import { extendObservable } from 'mobx';
import { hashHistory } from 'react-router';

export default class TreeChunkStore {
  constructor() {
    extendObservable(this, {
      tree: {},
      chunks: [],
      story: []
    });
  }

  adjustPopularity(chunkId, adjust){
    fetch("/adjustChunk",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chunkId: chunkId,
        adjustment: adjust
      })
    });
  }

}
