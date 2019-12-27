import React from 'react';
import moment from 'moment';
import abliLevel from './AbilityLevel.json';

export default function AbilityIndicator(props) {
  const { currentYear } = props;
  // 没有数据的场合用默认数据代替

  if(!currentYear.ability){
   
    var n=0;
    var arr=[];
    var j=currentYear.level;
    while(n<abliLevel.data.length){
      var c=0;
      var bol=false;
      while(c<abliLevel.data[n].chara.length){
        if(j==abliLevel.data[n].chara[c].level){
          if(props.isSupervisor==abliLevel.data[n].chara[c].isSupervisor){
            bol=true;
          }
        }
        c++;
      }
      if(bol==true){
        arr.push(abliLevel.data[n])
      }
      n++;
    }

   }
  return (
    <>
      {currentYear &&
        currentYear.ability &&
        currentYear.ability.map(item => (
          <div className="IDPTrack__ability" key={item.REC_ID}>
            <div className="IDPTrack__ability__header">
              <div className="IDPTrack__ability__header__left">
                <div>{item.categocry}</div>
                <div>{item.competence}</div>
              </div>
              <div className="IDPTrack__ability__header__right">
                {item.reality}
              </div>
            </div>
            <div className="IDPTrack__ability__measures">
              {item.measures ? (
                item.measures.map(measure => {
                  return (
                    <div
                      key={measure.REC_ID}
                      className="IDPTrack__ability__measures__item"
                    >
                      <span className="ability__measure__date">
                        {moment(measure.endTime).format('MM-DD')}
                      </span>
                      <span className="ability__measure__name">
                        {measure.measures}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="IDPTrack__ability__measures__nomeasures">
                  N/A
                </div>
              )}
            </div>
          </div>
        ))}
        {((currentYear&&currentYear.ability)||(arr))?'':("N/A")}
        {
          arr&&arr.map((item,key) =>(
            <div className="IDPTrack__ability" key={key}>
            <div className="IDPTrack__ability__header">
              <div className="IDPTrack__ability__header__left">
                <div>{item.en}</div>
                <div>{item.ch}</div>
              </div>
              <div className="IDPTrack__ability__header__right">
                N/A
              </div>
            </div>
            <div className="IDPTrack__ability__measures">
              
                <div className="IDPTrack__ability__measures__nomeasures">
                  N/A
                </div>
            </div>
          </div>
          ))
        }
    </>
  );
}
