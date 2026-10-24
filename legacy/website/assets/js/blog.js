// JavaScript code
function search_blog() {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    var x = document.getElementsByClassName('blog');
    // x.push(document.getElementsByClassName('desciption'));

    for (i = 0; i < x.length; i++) {
        console.log(x[i]);
        if (!x[i].children[1].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "list-item";
        }
    }
}   