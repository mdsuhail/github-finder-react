import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN


export const GithubProvider = ({ children }) => {
    // const [users, setUsers] = useState([]);
    // const [loading, setLoading] = useState(true);

    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    }

    const [state, dispatch] = useReducer(githubReducer, initialState);

    //Get initial users (testing purposes)
    // const fetchUsers = async () => {
    //     setLoading();
    //     const res = await fetch(`${GITHUB_URL}/users`, {
    //         headers: {
    //             Authorization: `token ${GITHUB_TOKEN}`,
    //         },
    //     });

    //     const data = await res.json();
    //     // setUsers(data);
    //     // setLoading(false);

    //     dispatch({
    //         type: 'GET_USERS',
    //         payload: data 
    //     })
    // };

    //Get search results
    const searchUsers = async (text) => {
        setLoading();

        const params = new URLSearchParams({
            q: text
        })

        const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const { items } = await res.json();
        // setUsers(data);
        // setLoading(false);

        dispatch({
            type: 'GET_USERS',
            payload: items
        })
    };

    //Get single user
    const getUser = async (login) => {
        setLoading();
        const res = await fetch(`${GITHUB_URL}/users/${login}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (res.status === 404) {
            window.location = '/notfound';
        } else {
            const data = await res.json();
            dispatch({
                type: 'GET_USER',
                payload: data
            })
        }

    };

    //Get user repos
    const getUserRepos = async (login) => {
        setLoading();

        const params = new URLSearchParams({
            sort: 'start',
            per_page: 10,
        })

        const res = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const data = await res.json();
        // setUsers(data);
        // setLoading(false);

        dispatch({
            type: 'GET_REPOS',
            payload: data
        })
    };

    //Clear users from state
    const clearUsers = () => dispatch({
        type: 'CLEAR_USERS'
    })

    const setLoading = () => dispatch({
        type: 'SET_LOADING'
    })

    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                loading: state.loading,
                user: state.user,
                repos: state.repos,

                //enhanced way
                // ...state,
                // dispatch,

                // fetchUsers
                searchUsers,
                getUser,
                clearUsers,
                getUserRepos
            }}>
            {children}
        </GithubContext.Provider>
    )
}

export default GithubContext;