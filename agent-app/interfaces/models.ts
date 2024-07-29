export interface Film {
id : number ;
title : string;
director : string;
date : string;
duration : number;

}

export interface Scene {
    id: number;
    title: string;
    description: string;
    location: string;
    minutes: number;
    filmId:number;
  }
  
  export interface Character {
    id: number;
    name: string;
    role: string;
    actor: string;
    sceneId: number;
  }