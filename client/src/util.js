import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import VapeReview from "./VapeReview";

function Vape({currentUser, vapes }) {
    let { vapeId } = useParams();
    const vape_id = parseInt(vapeId);
    const user_id = currentUser?.id ?? undefined;

    const [vape, setVape] = useState(vapes[vapeId]);
    const [vapeReviews, setVapeReviews] = useState([]);
    const [errors, setErrors] = useState([]);

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        console.log(vapeReviews);
    }, [vapeReviews])

    useEffect(() => {
        vapes.forEach( (row, index) => {
            if (row.id === vape_id) {
                setVape(row);
            }
        });
    }, [vape_id, vapes])

    function addVapeReview(e)
    {
        setVapeReviews([...vapeReviews, e])
    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function fetchVapeReviews()
    {
        fetch(`/vapes/${vape_id}/vape_reviews`)
            .then(r=> r.json())
            .then(data => {
                let ordered = sortByKey(data, 'id')
                setVapeReviews(ordered)
            })
    }

    useEffect(()=>{
        fetchVapeReviews()
    }, [])

    function handleSubmit(e) {
        console.log({ user_id, vape_id, comment, rating });
        e.preventDefault();
        fetch(`/vape_reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id, vape_id, comment, rating }),
            }).then((r) => {
            if (r.ok) {
                r.json().then((e) => addVapeReview(e))
            }
            else {
                r.json().then((err) => setErrors(err.errors));
            }
        });
    }

    let renderVapeReviews = vapeReviews?.map((i)=> {    
        return <div key={i.id} className = "container">
            <VapeReview review={i} userId={user_id} vapeId={vape_id} updateVapeReview={fetchVapeReviews}/>
        </div>
    })

return(
    <div>
        <div className = "container">
            {vape !== undefined ?
                <h1 className = "sweet"> 
                    Name:{vape.name} 
                    Price: ${vape.price} 
                    <img className = "image" src = {vape.image_url}></img>
                </h1>
            : 'Not Found'}
        </div>
        { user_id && (
            <form onSubmit={(e)=> handleSubmit(e)}>
                <h1 className = "link6">Add A Review</h1>
                <label htmlFor="comment">Comment</label>
                <input
                    type="text"
                    id="comment"
                    autoComplete="off"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <label htmlFor="rating">Rating</label>
                <input
                    type="text"
                    id="rating"
                    autoComplete="off"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />

                <button type="submit">Submit</button>
                <div>
                    {errors.map((err) => (
                    <span className = "link3" key={err}>     {err}!</span>
                    ))}
                </div>
            </form>
        )}
        {renderVapeReviews}
    </div>
)}

export default Vape