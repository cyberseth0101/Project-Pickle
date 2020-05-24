import React, { Component } from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import axios from 'axios';


class MediaGrid extends Component {
  state = {
    redditData: [],
    nextId: null
  }

  getRickAndMorty(id) {
    if (id) {
      return axios.get(`https://www.reddit.com/r/rickandmorty.json?after=` + id);
    }

    return axios.get(`https://www.reddit.com/r/rickandmorty/new.json`)
  }

  getMortytown() {
    return axios.get(`https://www.reddit.com/r/mortytown/new.json`)
  }

  componentDidMount() {
    axios.all([this.getRickAndMorty(), this.getMortytown()])
      .then(axios.spread((res, mortys) => {

        const redditData = [];

        this.getRickAndMorty(res.data.data.children[res.data.data.children.length - 1].data.id).then(res => {
          res.data.data.children.forEach(element => {
            let url = element.data.url;

            if (url.endsWith("jpg") || url.endsWith("png") || url.endsWith("gif")) {
              redditData.push(url);
            }

          });

          this.getRickAndMorty(res.data.data.children[res.data.data.children.length - 1].data.id).then(res2 => {
            res2.data.data.children.forEach(element => {
              let url = element.data.url;

              if (url.endsWith("jpg") || url.endsWith("png") || url.endsWith("gif")) {
                redditData.push(url);
              }

            });
          })
        })

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


        this.setState({ redditData, nextId: res.data.data.children[res.data.data.children.length - 1].data.id });

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