import { RouterLinkActive } from '@angular/router';
import { MockModule, MockRender, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { AppModule } from '../components/app.module';
import { ProjectStoreService } from '../project/project-store.service';
import { AccountPermissionService } from '../uiconfig/account-permission.service';
import { ProjectPermissionService } from '../uiconfig/project-permission.service';
import { PageConfig, UiConfig } from '../uiconfig/uiconfig-data-source.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [MockModule(AppModule)],
            providers: [
                {
                    provide: ProjectStoreService,
                    useValue: {
                        project$: of({ state: 'LOADED', value: { id: 'mock', name: 'Mock' } }),
                        projects$: of({ state: 'LOADED', value: [{ id: 'mock', name: 'Mock' }, { id: 'mock2', name: 'Mock 2' }] })
                    }
                },
                {
                    provide: ProjectPermissionService,
                    useValue: {
                        getAvailablePages: () => of([
                            { name: 'dashboard' } as PageConfig,
                            { name: 'staffing' } as PageConfig,
                            { name: 'team' } as PageConfig,
                            { name: 'finance' } as PageConfig,
                        ]),
                    }
                },
                {
                    provide: AccountPermissionService,
                    useValue: {
                        accountConfigs$: of([
                            {
                                pages: [{
                                    name: 'dashboard',
                                } as PageConfig,
                                {
                                    name: 'team'
                                } as PageConfig]
                            } as UiConfig
                        ]),
                    }
                }
            ]
        });
    });

    it('should create', () => {
        const fixture = MockRender(HeaderComponent);

        expect(fixture.point.componentInstance).toBeDefined();
    });

    it('should react on active tab change', () => {

        const component = MockRender(HeaderComponent).point.componentInstance;

        const tabsContainer = ngMocks.find('.project-tabs');
        const tabsActive = ngMocks.findInstances(tabsContainer, RouterLinkActive);

        expect(component.activeProjectTab).toBeUndefined();

        tabsActive[0].isActiveChange.emit(true);

        expect(component.activeProjectTab).toBe('');

        tabsActive[1].isActiveChange.emit(true);

        expect(component.activeProjectTab).toBe('staffing');

        tabsActive[2].isActiveChange.emit(true);

        expect(component.activeProjectTab).toBe('team');

        tabsActive[3].isActiveChange.emit(true);

        expect(component.activeProjectTab).toBe('finance');
    });

    it('should filter tabs by permission', () => {
        const service = ngMocks.findInstance(ProjectPermissionService);
        spyOn(service, 'getAvailablePages').and.callFake(() => of([
            { name: 'dashboard' } as PageConfig,
            { name: 'staffing' } as PageConfig,
        ]));

        const component = MockRender(HeaderComponent).point.componentInstance;

        const tabsContainer = ngMocks.find('.project-tabs');
        const tabsActive = ngMocks.findInstances(tabsContainer, RouterLinkActive);

        expect(component.activeProjectTab).toBeUndefined();
        expect(tabsActive.length).toBe(2);

        tabsActive[0].isActiveChange.emit(true);

        expect(component.activeProjectTab).toBe('');

        tabsActive[1].isActiveChange.emit(true);

        expect(component.activeProjectTab).toBe('staffing');
    });
});
