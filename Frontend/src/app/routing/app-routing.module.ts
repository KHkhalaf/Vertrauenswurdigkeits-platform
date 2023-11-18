import { NgModule } from '@angular/core';
import { UnternehmenDetailsComponent } from '../components/unternehmen-details/unternehmen-details.component';
import { RouterModule, Routes } from '@angular/router';
import { UnternehmenListComponent } from '../components/unternehmen-list/unternehmen-list.component';
import { SicherheitComponent } from '../components/sicherheit/sicherheit.component';
import { UnternehmenWebseiteComponent } from '../components/unternehmen-webseite/unternehmen-webseite.component';


const routes: Routes = [
  {
    path: 'unternehmenList/:isVergleichen',
    component: UnternehmenListComponent
  },
  {
    path: 'unternehmenvergleichenchart/:unternehmenName1/:unternehmenName2Orfalse',
    component: UnternehmenDetailsComponent
  },
  {
    path: 'sicherheit/:unternehmenName1/:unternehmenName2Orfalse',
    component: SicherheitComponent
  },
  {
    path: 'webseite',
    component: UnternehmenWebseiteComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
