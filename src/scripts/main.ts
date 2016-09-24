import {merge} from 'rxjs/Observable/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/map';
import * as Rx from 'rxjs/Rx'

import {run} from '@cycle/rxjs-run';
import {div, label, input, span, button, hr, h1, h2, p, ol, li, table, tr, th, td, makeDOMDriver} from '@cycle/dom';
import {Mountains} from "./domains/valueobjects/Mountains";

function intent(domSource) {
    return {
        check$: domSource.select('.check')
            .events('click')
            .map(ev => {
                return {
                    id: ev.target.dataset.id,
                    checked: ev.target.checked
                };
            })
    }
}

function model(actions) {
    const check$ = actions.check$.map(check => {
        return (xs) => (xs.map(x => {
            x[1] = x[0].id == check.id ? check.checked : x[1];
            return x;
        }));
    });

    var xs = [];
    Mountains.mountains.forEach((mountain) => {
        xs.push.apply(xs, [[mountain, false]]);
    });

    const modify$ = merge(check$)
        .startWith(xs)
        .scan((acc, f: Function) => {
            return f(acc);
        });

    return modify$;
}

function view(state$) {
    return state$.map((xs) =>
        div([
            div(
                '.mountain__header',
                [
                    p(
                        '.mountain__title',
                        '百名山カウンター'
                    )
                ]
            ),
            div(
                '.mountain__body',
                [
                    table(
                    '.mountain__table',
                    [
                        tr(
                            '.mountain__th',
                            [th(''), th('山名'), th('エリア'), th('標高')]
                        ),
                        ...xs.map(x => tr(
                            '.mountain__tr',
                            [
                                td([
                                    input('.check',
                                        {
                                            attrs: {
                                                type: 'checkbox',
                                                checked: x[1],
                                                'data-id': x[0].id
                                            }
                                        }
                                    )
                                ]),
                                td([
                                    x[0].name
                                ]),
                                td([
                                    x[0].area
                                ]),
                                td([
                                    x[0].height + 'm'
                                ])
                            ]
                        ))
                    ])
                ]
            ),
            div(
                '.mountain__footer',
                [
                    p(
                        '.mountain__result',
                        'あなたは百名山を' + xs.filter(x => x[1]).length.toString() + '座登頂しました'
                    )
                ]
            )
        ])
    );
}

function main(sources) {
    return {
        DOM: view(model(intent(sources.DOM)))
    };
}

run(main, { DOM: makeDOMDriver('#app-container') });