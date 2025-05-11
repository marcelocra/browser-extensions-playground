let tabs = await chrome.tabs.query({});

let map = {};

const res = tabs.map(async (tab) => {
  let gId = tab.groupId
  if (gId === -1) {
    gId = 'no group';
  } else {
    const group = await chrome.tabGroups.get(gId);
    gId = group.title
  }

  return [gId, tab];
})

const groupToTab = await Promise.all(res)
groupToTab.forEach(([gId, tab]) => {
  if (!map[gId]) {
    map[gId] = []
  }

  map[gId].push(tab.url);
})

console.log(map);
