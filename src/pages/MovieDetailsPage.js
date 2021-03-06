import * as ApiService from '../components/apiservice/apiservice';
import { useState, useEffect, lazy, useMemo, Suspense } from 'react';
import {
  useParams,
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';

const Cast = lazy(() => import('./Cast'));
const Reviews = lazy(() => import('./Reviews'));
export default function MovieDetailsPage() {
  const location = useLocation();
  const prevLocet = useMemo(() => location?.state?.from ?? '/', []);
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const moviesId = slug.match(/[a-z0-9]+$/)[0];

  useEffect(() => {
    ApiService.fetchMovieId(moviesId).then(setMovie);
  }, [moviesId]);
  const GoBack = () => {
    history.push(prevLocet);
  };
  return (
    <>
      <button type="button" onClick={GoBack}>
        Go back
      </button>
      {movie && (
        <>
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.data.poster_path}`}
              alt={movie.data.original_title}
              height="400"
            />
            <p>{movie.data.original_title}</p>
            <p>User score{movie.data.vote_average}%</p>
            <p>Overview{movie.data.overview}</p>
            {movie.data.genres.map(genre => {
              return <p key={genre.id}>{genre.name}</p>;
            })}
          </div>
          <hr />

          <NavLink to={`${url}/cast`}>Cast</NavLink>

          <NavLink to={`${url}/reviews`}>Reviews</NavLink>

          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path={`${path}/cast`}>
                <Cast />
              </Route>
              <Route path={`${path}/reviews`}>
                <Reviews />
              </Route>
            </Switch>
          </Suspense>
        </>
      )}
    </>
  );
}
