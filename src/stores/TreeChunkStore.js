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

  fetchTree(){
    fetch("/getTree/" + this.props.params.treeId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      this.setState({
        tree: res
      });
    }).then(()=>{this.getChunks(this.state.tree.chunk._id);});
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
