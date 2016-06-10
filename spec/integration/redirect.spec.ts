import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';
import { ReflectiveInjector, Component, Injectable } from '@angular/core';
import { describe, it, beforeEach, beforeEachProviders, async, inject } from '@angular/core/testing';
import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';
import { Observable } from 'rxjs/Observable';

import { provideRouter, Guard, Routes, Route, RouterInstruction, Router } from '../../lib';



describe('Redirects (Integration)', function() {
  let homeRoute: Route,
      aboutRoute: Route,
      companyRoute: Route,
      teamRoute: Route,
      blogRoute: Route,
      postRoute: Route,
      oldPostsRoute: Route;

  const routes: Routes = [
    homeRoute = {
      path: '/'
    },
    aboutRoute = {
      path: '/about'
    },
    companyRoute = {
      path: '/company',
      redirectTo: '/about',
      children: [
        teamRoute = {
          path: '/team'
        }
      ]
    },
    blogRoute = {
      path: '/blog',
      children: [
        postRoute = {
          path: '/:id'
        }
      ]
    },
    oldPostsRoute = {
      path: '/posts',
      children: [
        {
          path: '*',
          redirectTo: '/blog/*'
        }
      ]
    }
  ];

  let router: Router;
  let instruction$: RouterInstruction;

  beforeEachProviders(() => [
    provideRouter(routes, MockLocationStrategy)
  ]);

  beforeEach(inject(
    [ Router, RouterInstruction ],
    function(_router: Router, _ins: RouterInstruction) {
      router = _router;
      instruction$ = _ins;
    }
  ));

  it('should fire a redirect if the router teminates on a redirect route', function(done) {
    instruction$.take(1).subscribe({
      next({ routes }) {
        expect(routes).toEqual([ aboutRoute ]);
      },
      error: done,
      complete: done
    });

    router.go('/company');
  });

  it('should fire a relative redirect if the router terminates on a nested route', function(done) {
    instruction$.take(1).subscribe({
      next({ routes }) {
        expect(routes).toEqual([ blogRoute, postRoute ]);
      },
      error: done,
      complete: done
    });

    router.go('/posts/123');
  });

  it('should redirect if the router hits a higher level redirect', function(done) {
    instruction$.take(1).subscribe({
      next({ routes }) {
        expect(routes).toEqual([ aboutRoute ]);
      },
      error: done,
      complete: done
    });

    router.go('/company/team');
  });

  it('should not redirect if none of the matches routes redirect', function(done) {
    instruction$.take(1).subscribe({
      next({ routes }) {
        expect(routes).toEqual([ aboutRoute ]);
      },
      error: done,
      complete: done
    });

    router.go('/about');
  });

  it('should preserve query params when it redirects', function(done) {
    instruction$.take(1).subscribe({
      next({ routes, locationChange }) {
        expect(routes).toEqual([ blogRoute, postRoute ]);
        expect(locationChange.path).toEqual('/blog/123?find=something');
      },
      error: done,
      complete: done
    });

    router.go('/posts/123', { find: 'something' });
  });
});
