/// <reference types="chrome"/>
const sendMessage = <T, R> (tabId: number, message: T): Promise<R> => {
  return chrome.tabs.sendMessage<T, R>(tabId, message);
};

const sendMessageToActiveTab = async <T, R> (message: T): Promise<R> => {
  const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  if (!activeTab || !activeTab.id) {
    throw new Error('Active tab is not found');
  }

  return sendMessage<T, R>(activeTab.id, message);
};

export const messageService = {
  sendMessage,
  sendMessageToActiveTab,
};
