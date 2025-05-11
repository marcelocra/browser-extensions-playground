const ptBr = {
  tabs: {
    groups: {
      noGroupTitle: 'Sem grupo',
    },
  },
  buttons: {
    saveOpenedTabs: 'Salvar abas abertas',
  }
}

const en = { ...ptBr }
en.buttons.saveOpenedTabs = 'Save opened tabs';
en.tabs.groups.noGroupTitle = 'No group';

const strings = { ptBr, en }

document.addEventListener('DOMContentLoaded', async () => {
  new SaveOpenedTabsButton();


});

class SaveOpenedTabsButton {
  constructor(id = 'save-opened-tabs', lang = "ptBr") {
    this.id = id;
    this.t = strings[lang];

    this.el = document.getElementById(id)
    this.el.innerText = this.t.buttons.saveOpenedTabs;

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.el.addEventListener('click', async () => {
      await this.saveOpenedTabs();
    });
  }

  async saveOpenedTabs() {
    let tabs = await chrome.tabs.query({});

    // Add group info to tab.
    const tabWithGroupInfo = await Promise.all(tabs.map(async (tab) => {
      let gId = tab.groupId
      if (gId === -1) {
        tab.group = {
          id: -1,
          title: this.t.tabs.groups.noGroupTitle,
        }
      } else {
        const group = await chrome.tabGroups.get(gId);
        tab.group = {
          id: group.id,
          title: group.title,
        }
      }

      return tab;
    }))

    const keyedTabsToStore =
      tabWithGroupInfo.map((tab) => {
        return {
          [`${tab.id}___${tab.windowId}___${tab.groupId}`]: { ...tab }
        }
      }).reduce((acc, curr) => {
        return { ...acc, ...curr }
      }, {})

    console.log(keyedTabsToStore);
    await chrome.storage.sync.set(keyedTabsToStore);
  }
}
