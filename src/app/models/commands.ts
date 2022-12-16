export const enum Commands {
  GetCollectableInfo = 'GET_COLLECTABLE_INFO',
}

export interface CommandMessage {
  command: Commands,
}
