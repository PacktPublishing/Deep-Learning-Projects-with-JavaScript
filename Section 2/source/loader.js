async function url_live(url) {
  // Test if an url can be accessed.
  status('Testing url ' + url, '20');
  try {
    var response = await fetch(url, {method: 'HEAD'});
    return response.ok;
  } catch (err) {
    return false;
  }
}

async function get_review_data(what, where) {
  // Get the review data for restaurants.
  // Learn more at: https://docs.citygridmedia.com/display/citygridv2/Reviews+API
  try {
    var url="https://api.citygridmedia.com/content/reviews/v2/search/";
    var params="where?where="+where+"&what="+what+"&publisher=test&format=json&tag=1722";
    var url=encodeURI(url+params);
    var reviews_json = await fetch(url);
    var reviews = await reviews_json.json();
    return reviews;
  } catch (err) {
    console.error(err);
  }
}
