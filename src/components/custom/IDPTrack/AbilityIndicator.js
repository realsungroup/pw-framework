import React from 'react';
import moment from 'moment';

export default function AbilityIndicator(props) {
  const { currentYear } = props;
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
                  无
                </div>
              )}
            </div>
          </div>
        ))}
    </>
  );
}
