import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from "../StoryScreens/CardStory";
import NoStories from "../StoryScreens/NoStories";
import Pagination from "./Pagination";
import "../../Css/Home.css"

import { useNavigate } from "react-router-dom"
const Home = () => {
  const search = useLocation().search
  const searchKey = new URLSearchParams(search).get('search')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";


  useEffect(() => {
    const getStories = async () => {

      setLoading(true)
      try {

        const { data } = await axios.get(`${backendUrl}/story/getAllStories?search=${searchKey || ""}&page=${page}`)

        if (searchKey) {
          navigate({
            pathname: '/',
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        }
        else {
          navigate({
            pathname: '/',
            search: `${page > 1 ? `page=${page}` : ""}`,
          });


        }
        // Defensive: ensure stories is always an array
        setStories(Array.isArray(data.data) ? data.data : []);
        // Defensive: ensure pages is always a positive integer
        setPages(Number.isInteger(data.pages) && data.pages > 0 ? data.pages : 1);

        setLoading(false)
      }
      catch (error) {
        setStories([]); // Ensure stories is always an array on error
        setLoading(false); // Set loading to false on error
      }
    }
    getStories()
  }, [setLoading, search, page, navigate])


  useEffect(() => {
    setPage(1)
  }, [searchKey])


  return (
    <div className="Inclusive-home-page">
      {loading ?

        <div className="skeleton_emp">
          {
            [...Array(6)].map(() => {
              return (
                // theme dark :> default : light
                <SkeletonStory key={uuidv4()} />
              )
            })}
        </div>

        :
        <div>
          <div className="story-card-wrapper">
            {Array.isArray(stories) && stories.length !== 0 ?
              stories.map((story) => {
                return (
                  <CardStory key={uuidv4()} story={story} />
                )
              }) : <NoStories />
            }
            <img className="bg-planet-svg" src="planet.svg" alt="planet" />
            <img className="bg-planet2-svg" src="planet2.svg" alt="planet" />
            <img className="bg-planet3-svg" src="planet3.svg" alt="planet" />

          </div>

          {/* Only render Pagination if pages > 1 */}
          {pages > 1 && (
            <Pagination page={page} pages={pages} changePage={setPage} />
          )}

        </div>

      }
      <br />
    </div>

  )

};

export default Home;