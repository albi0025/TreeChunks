import React from 'react';
import { Panel} from 'react-bootstrap';

class Chunk extends React.Component {

  constructor() {
    super();
    this.state = {
      story: []
    };

    this.perpareChunks = this.prepareChunks.bind(this);
  }

  componentWillMount(){
    this.prepareChunks(this.props.params.chunkId, []);
  }

  prepareChunks(chunkId, story){
    fetch("/getStory/" + chunkId, {
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(res => {
      story.push(res.content);
      if(typeof(res.parentchunk) == "string"){
        this.prepareChunks(res.parentchunk, story);
      } else {
        story.reverse();
        this.setState({
          story: story
        });
      }
    });
  }

  //get the chunk then see if it has a parent . loop throuhg that until there is no parent each time return the content

  render() {

    return (
      <Panel>
        {this.state.story}
      </Panel>
    );
  }
}

Chunk.propTypes = {
  params: React.PropTypes.object
};

export default Chunk;
