
function status(statusText, progress, isready) {
  // Show progress in progress bar
  // and print some diagnostic info related to the call.
  console.log(statusText);
  var s =document.getElementById('status');

  if(progress) {
      s.style.width=progress+'%';
  }

  // Hide the progress bar when we're done.
  if(isready == true) {
    s.parentElement.style.visibility='hidden';
    // Enable the search button again when
    // load everything.
    document.getElementById('search').removeAttribute('disabled');
  }
}

function do_analysis(classname) {
  // For each review calculate a probablity that
  // it's positive.
  var elements = document.getElementsByClassName(classname);

  function analyse(el) {
    // This is just a function
    // to capture the element that
    // we need to get the review text,
    // calculate the probablity and
    // put it in the last column.
    function predict(sa) {
      // Get the review text.
      // p is our analyser ready
      // for sentiment analysis.
      var rt=el.parentNode.childNodes[0].innerHTML;
      // Calculate the probability of it being positive.
      var score=sa.predict(rt);
      // Turn it into an actual percentage.
      var score=Math.round(parseFloat(score)*100);
      // Mark it visually depending on the percentage
      // we get.
      if(score > 51) {
        el.className='text-success';
      } else {
        el.className='text-danger';
      }
      // Add the percentage.
      el.innerHTML=score+'%';
    }
    // Return the actual function we
    // can later use with .then
    return predict;
    }

    for (var i = 0; i < elements.length; i++) {
      // Fire analyser when it's ready, passing
      // the specific row we want to work on.
      analyser.then(analyse(elements[i]));
    }
}

function load_search_results() {
 // Get reviews from an API,
 // put them into the table.
 document.getElementById('reviews_container').style.visibility='hidden';
 var where=document.getElementById('where').value;
 var what=document.getElementById('what').value;
 var reviews_table=document.getElementById('reviews');

 // Clean up current results so we can load
 // a new ones.
 while (reviews_table.firstChild) {
        reviews_table.removeChild(reviews_table.firstChild);
 }
 // Get reviews in JSON asynchronously.
 var reviews=get_review_data(what, where);
 document.getElementById('search').setAttribute('disabled','');

 // Define a new callback function to
 // fire when the data is ready.
 reviews.then(function(data) {
   // Oops: no results, unsupported input.
   if(!('results' in data) || data.results.reviews.length == 0) {
      status("Can't find any restaurants serving this food in the the City");
      document.getElementById('search').removeAttribute('disabled');
      return;
   }
   var reviews=data.results.reviews;
   // Load results into a table.
   for (var i=0;i<reviews.length;i++) {
     var tr=document.createElement('tr');

      var review=document.createElement('td');
      review.appendChild(document.createTextNode(reviews[i].review_text));
      tr.appendChild(review);

      var bname=document.createElement('td');
      bname.appendChild(document.createTextNode(reviews[i].business_name));
      tr.appendChild(bname);

      tr.insertAdjacentHTML('beforeend', '<td id="analyse-'+i+'" class="analyse"></td>');

      reviews_table.appendChild(tr);
   }
   // Fill in the last column
   // with the sentiment analysis
   // of each review.
   do_analysis('analyse');
   document.getElementById('reviews_container').style.visibility='visible';
   status('Reviews loaded','100',true);
 });
}
