export interface RawMoviesInterface {
    original_title: string;
    tmdbid: number;
    media: "movie" | "tv";
    overview: string;
    actor1: string | null;
    actor2: string | null;
    actor3: string | null;
    collection: string | null;
    release_date: string;
    poster_path: string;
    director: string | null;
}
