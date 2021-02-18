$(document).ready(function(){

  function detect_patterns(){
    patterns = [];

    for(var group in PATTERNS)
      for(var pattern in PATTERNS[group]['patterns'])
        patterns.push({highlight: PATTERNS[group]['patterns'][pattern], className: "mark_"+group+" pattern_"+pattern })

    return patterns;
  };

  function scan_marks(){
    var marks = {};

    $("mark").each(function(index, element){
      var group = $(this).attr("class").replace("mark_", "").split(/\s+/)[0];
      var pattern = $(this).attr("class").replace("pattern_", "").split(/\s+/)[1];
      var mark = $(this).text();

      if(!marks.hasOwnProperty(group))
        marks[group] = {};

      if(!marks[group].hasOwnProperty(mark))
        marks[group][mark] = pattern;
    });

    $("#results").html("");
    for(var group in marks){
      var title = PATTERNS[group]['description'] + " (" + Object.keys(marks[group]).length + ")";
      var content = $("<ul>");

      for(var mark in marks[group])
        content.append($("<li>").append($("<a>").attr({title: marks[group][mark], href: "#", 'data-toggle': "tooltip"}).html(mark)));

      $("<button>").addClass("collapsible").addClass("mark_"+group).html(title).appendTo("#results");
      $("<div>").addClass("content").html(content).appendTo("#results");
    }
  };

  $("#data-input").highlightWithinTextarea({
    highlight: detect_patterns
  });

  $(".hwt-highlights").on("highlight:done", scan_marks);

  $(document).on("click", ".collapsible", function(){
    this.classList.toggle("active");
    var content = this.nextElementSibling;

    if(content.style.maxHeight)
      content.style.maxHeight = null;
    else
      content.style.maxHeight = content.scrollHeight + "px";
  });

  $('[data-toggle="tooltip"]').tooltip();


  function copyToClipboard(element){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  }

  $(document).on("click", "#results a", function(){ copyToClipboard($(this)); return false; });

});
