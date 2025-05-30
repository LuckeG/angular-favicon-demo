import {
  Auth,
  authState
} from "./chunk-JBKE3U26.js";
import {
  FirebaseApp,
  FirebaseApps,
  VERSION,
  concatMap,
  distinct,
  distinctUntilChanged,
  filter,
  from,
  getAnalytics,
  getGoogleAnalyticsClientId,
  groupBy,
  initializeAnalytics,
  logEvent,
  map,
  mergeMap,
  of,
  pairwise,
  registerVersion,
  setAnalyticsCollectionEnabled,
  setConsent,
  setCurrentScreen,
  setDefaultEventParameters,
  setUserId,
  setUserProperties,
  settings,
  startWith,
  switchMap,
  timer,
  ɵAngularFireSchedulers,
  ɵgetAllInstancesOf,
  ɵgetDefaultInstanceOf,
  ɵisAnalyticsSupportedFactory,
  ɵzoneWrap
} from "./chunk-XX457IAK.js";
import {
  ActivationEnd,
  Router,
  ɵEmptyOutletComponent
} from "./chunk-MMNTZIU6.js";
import {
  Title
} from "./chunk-U2ARYDAB.js";
import "./chunk-QT5IVMMF.js";
import {
  APP_INITIALIZER,
  ComponentFactoryResolver$1,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Optional,
  __awaiter,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-OGAGMAZD.js";

// node_modules/@angular/fire/fesm2015/angular-fire-analytics.js
var Analytics = class {
  constructor(analytics) {
    return analytics;
  }
};
var ANALYTICS_PROVIDER_NAME = "analytics";
var AnalyticsInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(ANALYTICS_PROVIDER_NAME);
  }
};
var analyticInstance$ = timer(0, 300).pipe(concatMap(() => from(ɵgetAllInstancesOf(ANALYTICS_PROVIDER_NAME))), distinct());
var isSupported = ɵisAnalyticsSupportedFactory.async;
var getAnalytics2 = ɵzoneWrap(getAnalytics, true);
var initializeAnalytics2 = ɵzoneWrap(initializeAnalytics, true);
var logEvent2 = ɵzoneWrap(logEvent, true);
var setAnalyticsCollectionEnabled2 = ɵzoneWrap(setAnalyticsCollectionEnabled, true);
var setCurrentScreen2 = ɵzoneWrap(setCurrentScreen, true);
var settings2 = ɵzoneWrap(settings, true);
var setUserId2 = ɵzoneWrap(setUserId, true);
var setUserProperties2 = ɵzoneWrap(setUserProperties, true);
var UserTrackingService = class {
  constructor(auth, zone, injector) {
    this.disposables = [];
    registerVersion("angularfire", VERSION.full, "user-tracking");
    let resolveInitialized;
    this.initialized = zone.runOutsideAngular(() => new Promise((resolve) => {
      resolveInitialized = resolve;
    }));
    isSupported().then(() => {
      const analytics = injector.get(Analytics);
      if (analytics) {
        this.disposables = [
          // TODO add credential tracking back in
          authState(auth).subscribe((user) => {
            setUserId2(analytics, user === null || user === void 0 ? void 0 : user.uid);
            resolveInitialized();
          })
        ];
      } else {
        resolveInitialized();
      }
    });
  }
  ngOnDestroy() {
    this.disposables.forEach((it) => it.unsubscribe());
  }
};
UserTrackingService.ɵfac = function UserTrackingService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || UserTrackingService)(ɵɵinject(Auth), ɵɵinject(NgZone), ɵɵinject(Injector));
};
UserTrackingService.ɵprov = ɵɵdefineInjectable({
  token: UserTrackingService,
  factory: UserTrackingService.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserTrackingService, [{
    type: Injectable
  }], function() {
    return [{
      type: Auth
    }, {
      type: NgZone
    }, {
      type: Injector
    }];
  }, null);
})();
var FIREBASE_EVENT_ORIGIN_KEY = "firebase_event_origin";
var FIREBASE_PREVIOUS_SCREEN_CLASS_KEY = "firebase_previous_class";
var FIREBASE_PREVIOUS_SCREEN_INSTANCE_ID_KEY = "firebase_previous_id";
var FIREBASE_PREVIOUS_SCREEN_NAME_KEY = "firebase_previous_screen";
var FIREBASE_SCREEN_CLASS_KEY = "firebase_screen_class";
var FIREBASE_SCREEN_INSTANCE_ID_KEY = "firebase_screen_id";
var FIREBASE_SCREEN_NAME_KEY = "firebase_screen";
var OUTLET_KEY = "outlet";
var PAGE_PATH_KEY = "page_path";
var PAGE_TITLE_KEY = "page_title";
var SCREEN_CLASS_KEY = "screen_class";
var SCREEN_NAME_KEY = "screen_name";
var SCREEN_VIEW_EVENT = "screen_view";
var EVENT_ORIGIN_AUTO = "auto";
var SCREEN_INSTANCE_DELIMITER = "#";
var nextScreenInstanceID = Math.floor(Math.random() * (Math.pow(2, 32) - 1)) - Math.pow(2, 31);
var knownScreenInstanceIDs = {};
var getScreenInstanceID = (params) => {
  const screenInstanceKey = [params[SCREEN_CLASS_KEY], params[OUTLET_KEY]].join(SCREEN_INSTANCE_DELIMITER);
  if (knownScreenInstanceIDs.hasOwnProperty(screenInstanceKey)) {
    return knownScreenInstanceIDs[screenInstanceKey];
  } else {
    const ret = nextScreenInstanceID++;
    knownScreenInstanceIDs[screenInstanceKey] = ret;
    return ret;
  }
};
var ɵscreenViewEvent = (router, title, componentFactoryResolver) => {
  const activationEndEvents = router.events.pipe(filter((e) => e instanceof ActivationEnd));
  return activationEndEvents.pipe(switchMap((activationEnd) => {
    var _a;
    const urlTree = router.parseUrl(router.url.replace(/(?:\().+(?:\))/g, (a) => a.replace("://", ":///")));
    const pagePath = ((_a = urlTree.root.children[activationEnd.snapshot.outlet]) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    const actualSnapshot = router.routerState.root.children.map((it) => it).find((it) => it.outlet === activationEnd.snapshot.outlet);
    if (!actualSnapshot) {
      return of(null);
    }
    let actualDeep = actualSnapshot;
    while (actualDeep.firstChild) {
      actualDeep = actualDeep.firstChild;
    }
    const screenName = actualDeep.pathFromRoot.map((s) => {
      var _a2;
      return (_a2 = s.routeConfig) === null || _a2 === void 0 ? void 0 : _a2.path;
    }).filter((it) => it).join("/") || "/";
    const params = {
      [SCREEN_NAME_KEY]: screenName,
      [PAGE_PATH_KEY]: `/${pagePath}`,
      [FIREBASE_EVENT_ORIGIN_KEY]: EVENT_ORIGIN_AUTO,
      [FIREBASE_SCREEN_NAME_KEY]: screenName,
      [OUTLET_KEY]: activationEnd.snapshot.outlet
    };
    if (title) {
      params[PAGE_TITLE_KEY] = title.getTitle();
    }
    let component = actualSnapshot.component;
    if (component) {
      if (component === ɵEmptyOutletComponent) {
        let deepSnapshot = activationEnd.snapshot;
        while (deepSnapshot.firstChild) {
          deepSnapshot = deepSnapshot.firstChild;
        }
        component = deepSnapshot.component;
      }
    } else {
      component = activationEnd.snapshot.component;
    }
    if (typeof component === "string") {
      return of(Object.assign(Object.assign({}, params), {
        [SCREEN_CLASS_KEY]: component
      }));
    } else if (component) {
      const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
      return of(Object.assign(Object.assign({}, params), {
        [SCREEN_CLASS_KEY]: componentFactory.selector
      }));
    }
    return of(null);
  }), filter((it) => !!it), map((params) => Object.assign({
    [FIREBASE_SCREEN_CLASS_KEY]: params[SCREEN_CLASS_KEY],
    [FIREBASE_SCREEN_INSTANCE_ID_KEY]: getScreenInstanceID(params)
  }, params)), groupBy((it) => it[OUTLET_KEY]), mergeMap((it) => it.pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)), startWith(void 0), pairwise(), map(([prior, current]) => prior ? Object.assign({
    [FIREBASE_PREVIOUS_SCREEN_CLASS_KEY]: prior[SCREEN_CLASS_KEY],
    [FIREBASE_PREVIOUS_SCREEN_NAME_KEY]: prior[SCREEN_NAME_KEY],
    [FIREBASE_PREVIOUS_SCREEN_INSTANCE_ID_KEY]: prior[FIREBASE_SCREEN_INSTANCE_ID_KEY]
  }, current) : current))));
};
var ScreenTrackingService = class {
  constructor(router, title, componentFactoryResolver, zone, userTrackingService, injector) {
    registerVersion("angularfire", VERSION.full, "screen-tracking");
    isSupported().then(() => {
      const analytics = injector.get(Analytics);
      if (!router || !analytics) {
        return;
      }
      zone.runOutsideAngular(() => {
        this.disposable = ɵscreenViewEvent(router, title, componentFactoryResolver).pipe(switchMap((params) => __awaiter(this, void 0, void 0, function* () {
          if (userTrackingService) {
            yield userTrackingService.initialized;
          }
          return logEvent2(analytics, SCREEN_VIEW_EVENT, params);
        }))).subscribe();
      });
    });
  }
  ngOnDestroy() {
    if (this.disposable) {
      this.disposable.unsubscribe();
    }
  }
};
ScreenTrackingService.ɵfac = function ScreenTrackingService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ScreenTrackingService)(ɵɵinject(Router, 8), ɵɵinject(Title, 8), ɵɵinject(ComponentFactoryResolver$1), ɵɵinject(NgZone), ɵɵinject(UserTrackingService, 8), ɵɵinject(Injector));
};
ScreenTrackingService.ɵprov = ɵɵdefineInjectable({
  token: ScreenTrackingService,
  factory: ScreenTrackingService.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScreenTrackingService, [{
    type: Injectable
  }], function() {
    return [{
      type: Router,
      decorators: [{
        type: Optional
      }]
    }, {
      type: Title,
      decorators: [{
        type: Optional
      }]
    }, {
      type: ComponentFactoryResolver$1
    }, {
      type: NgZone
    }, {
      type: UserTrackingService,
      decorators: [{
        type: Optional
      }]
    }, {
      type: Injector
    }];
  }, null);
})();
var PROVIDED_ANALYTICS_INSTANCES = new InjectionToken("angularfire2.analytics-instances");
function defaultAnalyticsInstanceFactory(provided, defaultApp) {
  if (!ɵisAnalyticsSupportedFactory.sync()) {
    return null;
  }
  const defaultAnalytics = ɵgetDefaultInstanceOf(ANALYTICS_PROVIDER_NAME, provided, defaultApp);
  return defaultAnalytics && new Analytics(defaultAnalytics);
}
function analyticsInstanceFactory(fn) {
  return (zone, injector) => {
    if (!ɵisAnalyticsSupportedFactory.sync()) {
      return null;
    }
    const analytics = zone.runOutsideAngular(() => fn(injector));
    return new Analytics(analytics);
  };
}
var ANALYTICS_INSTANCES_PROVIDER = {
  provide: AnalyticsInstances,
  deps: [[new Optional(), PROVIDED_ANALYTICS_INSTANCES]]
};
var DEFAULT_ANALYTICS_INSTANCE_PROVIDER = {
  provide: Analytics,
  useFactory: defaultAnalyticsInstanceFactory,
  deps: [[new Optional(), PROVIDED_ANALYTICS_INSTANCES], FirebaseApp]
};
var AnalyticsModule = class {
  constructor(_screenTrackingService, _userTrackingService) {
    registerVersion("angularfire", VERSION.full, "analytics");
  }
};
AnalyticsModule.ɵfac = function AnalyticsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || AnalyticsModule)(ɵɵinject(ScreenTrackingService, 8), ɵɵinject(UserTrackingService, 8));
};
AnalyticsModule.ɵmod = ɵɵdefineNgModule({
  type: AnalyticsModule
});
AnalyticsModule.ɵinj = ɵɵdefineInjector({
  providers: [DEFAULT_ANALYTICS_INSTANCE_PROVIDER, ANALYTICS_INSTANCES_PROVIDER, {
    provide: APP_INITIALIZER,
    useValue: ɵisAnalyticsSupportedFactory.async,
    multi: true
  }]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnalyticsModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_ANALYTICS_INSTANCE_PROVIDER, ANALYTICS_INSTANCES_PROVIDER, {
        provide: APP_INITIALIZER,
        useValue: ɵisAnalyticsSupportedFactory.async,
        multi: true
      }]
    }]
  }], function() {
    return [{
      type: ScreenTrackingService,
      decorators: [{
        type: Optional
      }]
    }, {
      type: UserTrackingService,
      decorators: [{
        type: Optional
      }]
    }];
  }, null);
})();
function provideAnalytics(fn, ...deps) {
  return {
    ngModule: AnalyticsModule,
    providers: [{
      provide: PROVIDED_ANALYTICS_INSTANCES,
      useFactory: analyticsInstanceFactory(fn),
      multi: true,
      deps: [NgZone, Injector, ɵAngularFireSchedulers, FirebaseApps, ...deps]
    }]
  };
}
export {
  Analytics,
  AnalyticsInstances,
  AnalyticsModule,
  ScreenTrackingService,
  UserTrackingService,
  analyticInstance$,
  getAnalytics2 as getAnalytics,
  getGoogleAnalyticsClientId,
  initializeAnalytics2 as initializeAnalytics,
  isSupported,
  logEvent2 as logEvent,
  provideAnalytics,
  setAnalyticsCollectionEnabled2 as setAnalyticsCollectionEnabled,
  setConsent,
  setCurrentScreen2 as setCurrentScreen,
  setDefaultEventParameters,
  setUserId2 as setUserId,
  setUserProperties2 as setUserProperties,
  settings2 as settings,
  ɵscreenViewEvent
};
//# sourceMappingURL=@angular_fire_analytics.js.map
