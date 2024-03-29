import React from 'react';
import {Panel, PanelHeader, HeaderButton, platform, IOS, Group, Button, Header, Div, InfoRow, List, Cell} from '@vkontakte/vkui';
import qr from '@vkontakte/vk-qr';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import settings from '../constants.js';
import ClickImage from '../components/ClickImage';
import CustomTruncate from '../components/CustomTruncate';
import Icon24Info from '@vkontakte/icons/dist/24/info';
import connect from '@vkontakte/vkui-connect';
import swal from 'sweetalert';

const osname = platform();


export default class Film extends React.Component{
  constructor(props) {
		super(props);

    this.watch = this.watch.bind(this);

	}


  watch(token, filmid){
    if(!this.props.currentFilm.going){
    connect.send("VKWebAppTapticNotificationOccurred", {"type": "success"});
    fetch(`https://cinema.voloshinskii.ru/watch?token=${token}&filmId=${filmid}`)
      .then(res => res.json())
    }
    else{
      connect.send("VKWebAppTapticNotificationOccurred", {"type": "success"});
      fetch(`https://cinema.voloshinskii.ru/unwatch?token=${token}&filmId=${filmid}`)
        .then(res => res.json())
    }
    this.props.currentFilm.going = !this.props.currentFilm.going;
    this.setState({going: this.props.currentFilm.going});
  }


  share(filmid){
      connect.send("VKWebAppTapticNotificationOccurred", {"type": "success"});
      connect.send("VKWebAppShowWallPostBox", {"message": `https://vk.com/app6977050#${filmid}`});
  }

  render(){
    return(
      <Panel id={this.props.id} theme='white'>
    		<PanelHeader
    			left={<HeaderButton onClick={this.props.go} data-to="home">
    				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
    			</HeaderButton>}
    		>
    			{this.props.currentFilm && this.props.currentFilm.title}
    		</PanelHeader>
          {this.props.currentFilm &&
            <ClickImage back={settings.image_url + this.props.currentFilm.tmdbFullData.backdrop_path}
                        front={this.props.currentFilm.image}
                        title={this.props.currentFilm.title}
            />
          }
          <Group style={{marginTop: 0, overflow: 'auto'}}>
            <Div>
              {this.props.currentFilm && this.props.currentFilm.tmdbFullData.vote_average > 0 &&
                <InfoRow style={{display: 'inline-block'}} title='Рейтинг'>
                  <span style={{color: '#528bcc', fontWeight: 'bold', fontSize: 20}}>
                    {this.props.currentFilm.tmdbFullData.vote_average}
                  </span>
                </InfoRow>
              }

              {this.props.currentFilm && this.props.currentFilm.tmdbFullData.runtime > 0 &&
                <InfoRow style={{display: 'inline-block', float: 'right'}} title='Продолжительность'>
                  <span style={{color: 'grey', fontWeight: 'bold', fontSize: 20}}>
                    {this.props.currentFilm.tmdbFullData.runtime} мин
                  </span>
                </InfoRow>
              }
            </Div>
          </Group>


          <Div>
            {this.props.currentFilm && this.props.currentFilm.tmdbFullData.overview &&
              <CustomTruncate
                text={this.props.currentFilm.tmdbFullData.overview}
              />
            }
          </Div>

          {this.props.currentFilm && this.props.currentFilm.video &&
            <Group title="Трейлер"><iframe width="100%" height="200" style={{margin:'auto'}} src={`https://www.youtube.com/embed/${this.props.currentFilm.video}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></Group>
          }



          <Group>
            <Div>
              {this.props.currentFilm && (this.props.currentFilm.tmdbFullData.release_date) && <InfoRow title='Премьера'>{new Date(this.props.currentFilm.tmdbFullData.release_date).toLocaleString('ru', {year: 'numeric',month: 'long',day: 'numeric'})}</InfoRow>}
            </Div>
            <Div>
              {this.props.currentFilm && (this.props.currentFilm.tmdbFullData.budget > 0) && <InfoRow title='Общий бюджет'>{this.props.currentFilm.tmdbFullData.budget.toLocaleString('ru')}$</InfoRow>}
            </Div>
            <Div>
              {this.props.currentFilm && (this.props.currentFilm.tmdbFullData.revenue > 0) && <InfoRow title='Сборы'>{this.props.currentFilm.tmdbFullData.revenue.toLocaleString('ru')}$</InfoRow>}
            </Div>
          </Group>
          <div style={{width: '90%', margin: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            {this.props.currentFilm && !this.props.currentFilm.going && <Button size="xl" style={{width:"100%", display: "inline-block"}} level="secondary" onClick={() => { this.watch(this.props.authToken, this.props.currentFilm._id) }}>Иду на фильм</Button>}
            {this.props.currentFilm && this.props.currentFilm.going && <Button size="xl" style={{width:"100%", display: "inline-block"}} level="secondary" onClick={() => {  this.watch(this.props.authToken, this.props.currentFilm._id) }}>Удалить из списка</Button>}
          </div>
          <Group>
          <Div>
            {<InfoRow title='Поделиться фильмом'><div style={{width: '256px', margin: 'auto'}} dangerouslySetInnerHTML={{__html: qr.createQR(`https://vk.com/app6977050#1`, 256, 'qr-code-class', true)}}/></InfoRow>}
            <div style={{width: '256px', margin: 'auto', textAlign: 'center', color: 'grey', marginBottom: '20px'}}>Вы можете поделиться данной станицей со своими друзьями. При наведении на QR-код откроется данная страница</div>
            <div style={{width: '90%', margin: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button size="l" style={{width:"49%"}} level="primary" onClick={() => { this.share(this.props.currentFilm.tmdbId) }}>Поделиться</Button>
              <Button size="l" style={{width:"49%"}} component="a" href="https://vk.com/wall-58810575_52712" level="secondary">Как сканировать?</Button>
            </div>
          </Div>
          </Group>
      </Panel>
  )}
}
