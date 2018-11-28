import { HumanVsAiComponent } from './components/human-vs-ai/human-vs-ai.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AiVsAiComponent } from './components/ai-vs-ai/ai-vs-ai.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'hva', component: HumanVsAiComponent },
  { path: 'ava', component: AiVsAiComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
``
