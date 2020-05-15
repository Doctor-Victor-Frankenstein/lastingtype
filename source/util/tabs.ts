import { browser, Tabs } from "webextension-polyfill-ts";

export function openExtOptionsPage(): Promise<void> {
  return browser.runtime.openOptionsPage();
}

export function getCurrentTab(): Promise<Tabs.Tab[]> {
  return browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
}

export async function getTabUrl(): Promise<string> {
  const currentTab = await getCurrentTab();
  const url = currentTab.length ? currentTab[0].url : "";
  return url || "";
}

export function goTo(url: string): Promise<Tabs.Tab> {
  return browser.tabs.update({
    url,
  });
}

export function isValidUrl(url: string): boolean {
  // https://regex101.com/r/iXVlNL/1/
  const re = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/;

  return re.test(url);
}
