export interface Episode {
    airdate: string;
    id: number;
    name: string;
    number: number;
    rating: {average: number},
    runtime: number; // in minutes
    season: number;
    summary: string;
    image: {
        medium: string;
        original: string;
    }
}

export interface Series {
    name: string;
    premiered: string;
    genres: string[];
    _embedded: {
        episodes: Episode[];
    }
}

export interface SeasonsWithEpisodes {
    [season: number]: Episode[];
}
