import { Component } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { unwrapLoadingStateErrorIgnore } from 'common-ui';
import { Observable, map, mergeMap, shareReplay, tap } from 'rxjs';

import { Project } from '../data-source.service';
import { ProjectStoreService } from '../project/project-store.service';
import { ProjectPermissionService } from '../uiconfig/project-permission.service';
import { PageConfig, PageName, UiConfig } from '../uiconfig/uiconfig-data-source.service';
import { AccountPermissionService } from '../uiconfig/account-permission.service';

const activeOptions: IsActiveMatchOptions = {
    fragment: 'ignored',
    matrixParams: 'ignored',
    paths: 'subset',
    queryParams: 'ignored'
};

const allMenuLinks: {[key in PageName]?: { label: string, path: string, activeOptions: IsActiveMatchOptions } } = {
    dashboard: { label: 'Dashboard', path: '', activeOptions: { ...activeOptions, paths: 'exact' } },
    positions: { label: 'Positions', path: 'positions', activeOptions },
    staffing: { label: 'Staffing', path: 'staffing', activeOptions },
    team: { label: 'Team', path: 'team', activeOptions },
    finance: { label: 'Finances', path: 'finance', activeOptions },
    //temp solution until finance widgets configuration is fully done
    financeCtc: { label: 'Finances', path: 'finance-ctc', activeOptions },
};

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    public projects$ = this.projectStore.projects$;
    public project$ = this.projectStore.project$.pipe(
        unwrapLoadingStateErrorIgnore(),
        tap((project) => {
            if (!project) {
                this.activeProjectTab = undefined;
            }
        }),
        shareReplay(1)
    );

    public readonly defaultLogo: string = 'assets/logo-client-portal.svg';

    public activeProjectTab?: string;
    public logoUrl$ = this.accountPermissionService.accountConfigs$.pipe(
        map((config: UiConfig)  => config.inputs?.['logoUrl'] || this.defaultLogo)
    );

    public availableMenuLinks$: Observable<{ label: string, path: string, activeOptions: IsActiveMatchOptions }[]> = this.project$.pipe(
        mergeMap((project: Project | undefined) => this.projectPermissionService.getAvailablePages(project?.id || '')),
        map((pages: PageConfig[]) => pages.map(page => {
            let menu = allMenuLinks[page.name];
            if(!!menu) {
                menu = this.updateMenu(menu, page);
            }
            return menu;
            })
            .filter((value) => value != undefined) as { label: string, path: string, activeOptions: IsActiveMatchOptions }[]
        ));

    constructor(
        private projectStore: ProjectStoreService,
        private projectPermissionService: ProjectPermissionService,
        private accountPermissionService: AccountPermissionService,
    ) {}

    private updateMenu(menu: { label: string, path: string, activeOptions: IsActiveMatchOptions }, page: PageConfig) {
        return {
            ...menu,
            label: page?.inputs?.["pageName"] || menu.label,
        }
    }

    public activeTabChange(active: boolean, path?: string): void {
        if (active) {
            this.activeProjectTab = path;
        }
    }

    public projectLink(project: string, tab?: string) {
        return tab ? ['project', project, tab] : ['project', project];
    }
}
