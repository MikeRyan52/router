import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';
import { ReflectiveInjector, Component, Injectable } from '@angular/core';
import { describe, it, beforeEach, beforeEachProviders, async, inject } from '@angular/core/testing';
import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';
import { Observable } from 'rxjs/Observable';

import { provideRouter, Guard, Routes, Route, RouterInstruction, Router } from '../../lib';


describe('Route Traverser (Integration)', function() {
  @Component({
    selector: 'test-component',
    template: `This is a test`
  })
  class TestComponent { }

  let notFoundRoute: Route;
  let homeRoute: Route;

  const routes: Routes = [
    homeRoute = {
      path: '/home',
      component: TestComponent
    },
    notFoundRoute = {
      path: '/*',
      redirectTo: '/home'
    }
  ];

  let router: Router;
  let instruction$: RouterInstruction;

  beforeEachProviders(() => [
    provideRouter(routes, MockLocationStrategy)
  ]);

  beforeEach(inject([ Router, RouterInstruction ], function(
    _router: Router,
    _instruction: RouterInstruction
  ) {
    router = _router;
    instruction$ = _instruction;
  }));

  it('should correctly redirect if it lands on a not-found route', function(done) {
    instruction$.take(1).subscribe({
      next(ins) {
        expect(ins.routes).toEqual([ homeRoute ]);
      },
      error: done,
      complete: done
    });

    router.go('/do-not-find-me');
  });

  it('should correctly 404 if there is not a slash route', function(done) {
    instruction$.take(1).subscribe({
      next(ins) {
        expect(ins.routes).toEqual([ homeRoute ]);
      },
      error: done,
      complete: done
    });

    router.go('/');
  });
});
