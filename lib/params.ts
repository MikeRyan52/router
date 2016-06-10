import 'rxjs/add/operator/map';
import { SelectSignature, select } from '@ngrx/core/operator/select';
import { Observable } from 'rxjs/Observable';
import { Provider, Injectable } from '@angular/core';

import { RouterInstruction } from './router-instruction';

@Injectable()
export abstract class RouteParams extends Observable<{ [param: string]: any }> {
  constructor(instruction$: RouterInstruction) {
    super(subscriber => {
      const subscription = instruction$.map(next => next.routeParams).subscribe(subscriber);

      return () => subscription.unsubscribe();
    });
  }

  select: SelectSignature<{ [param: string]: any }> = select.bind(this);
}

@Injectable()
export abstract class QueryParams extends Observable<{ [param: string]: any }> {
  constructor(instruction$: RouterInstruction) {
    super(subscriber => {
      const subscription = instruction$.map(next => next.queryParams).subscribe(subscriber);

      return () => subscription.unsubscribe();
    });
  }

  select: SelectSignature<{ [param: string]: any }> = select.bind(this);
}

export const PARAMS_PROVIDERS = [
  new Provider(RouteParams, {
    useClass: RouteParams
  }),
  new Provider(QueryParams, {
    useClass: QueryParams
  })
];
