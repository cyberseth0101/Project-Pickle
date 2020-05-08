import React, { Component } from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import axios from 'axios';


class MediaGrid extends Component {
  state = {
    redditData: []
  }

  getRickAndMorty() {
    return axios.get(`https://www.reddit.com/r/rickandmorty/new.json`)
  }

  getMortytown() {
    return axios.get(`https://www.reddit.com/r/mortytown/new.json`)
  }

  componentDidMount() {
    axios.all([this.getRickAndMorty(), this.getMortytown()])
      .then(axios.spread((res, mortys) => {

        const redditData = [];
        res.data.data.children.forEach(element => {
          let url = element.data.url;

          if (url.endsWith("jpg") || url.endsWith("png") || url.endsWith("gif")) {
            redditData.push(url);
          }

        });

        mortys.data.data.children.forEach(element => {
          let url = element.data.url;

          if (url.endsWith("jpg") || url.endsWith("png") || url.endsWith("gif")) {
            redditData.push(url);
          }

        });


        this.setState({ redditData });
        console.log(this.state)
      }))


  }



  createGrid() {
    let columns = [];
    this.props.soundPlaying.forEach(element => {
      columns.push(
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <Image src={this.state.redditData[Math.floor(Math.random() * this.state.redditData.length)]} />
        </Grid.Column>
      );
    });
    return columns;
  }

  render() {
    return (
        <Grid>
          {this.createGrid()}
        </Grid>


    )
  }
}

export default MediaGrid;