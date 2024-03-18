import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        // path: 'project/:project',
        // component: ProjectComponent,
        // canActivate: [AuthGuard],
        // children: [
        //     { path: '', component: DashboardComponent, canActivate: [ProjectPermissionGuard], data: { pageName: 'dashboard' } },
        //     { path: 'team', component: TeamComponent, canActivate: [ProjectPermissionGuard], data: { pageName: 'team' } },
        // ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }
