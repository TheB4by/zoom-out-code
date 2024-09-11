document.addEventListener("DOMContentLoaded", function() {
    const svgObject = document.getElementById("svgMap");

    svgObject.addEventListener('load', function() {
        const svgDoc = svgObject.contentDocument;
        const paths = svgDoc.querySelectorAll("path");

        paths.forEach(path => {
            path.style.fill = 'gray';  // Cor inicial

            path.addEventListener("mouseover", function() {
                path.style.fill = '#FFA629';  // Cor ao passar o mouse
            });

            path.addEventListener("mouseout", function() {
                path.style.fill = 'gray';  // Cor ao retirar o mouse
            });
        });
    });
});
