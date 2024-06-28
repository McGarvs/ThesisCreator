(function($) {
  function isEmpty(obj) {
    for (const key in obj) {
      if (obj[key] !== "") {
        return false;
      }
    }
    return true;
  }
  const exampleThesis = {
    prompt: "Was the New Deal of the 1930s a liberal plan to create a welfare state in America, or was it a conservative defense of American capitalism?",
    title: "New Deal: Welfare State or Savior of Capitalism",
    position: "The New Deal is best understood as a defense of American capitalism",
    qualification: "Despite its work relief elements and large government programs,",
    reason: "because its main programs attempted to create a stable environment for private enterprise.",
    thesis: "Despite its work relief elements and large government programs, the New Deal is best understood as a defense of American capitalism because its main programs attempted to create a stable environment for private enterprise.",
  }
  const draftThesis = {
    prompt: "",
    title: "",
    position: "",
    qualification: "",
    reason: "",
    thesis: "",
  }

  // Reset certain page elements on (re)load because firefox caches it
  $("textarea").val("");
  $("#createThesisButton").prop('disabled', true);

  // Update draftThesis on textarea input
  $("textarea").on('input', function() {
    draftThesis[this.name] = this.value;
    if (isEmpty(draftThesis)) {
      $("#createThesisButton").prop('disabled', true);
    } else {
      $("#createThesisButton").prop('disabled', false);
    }
  });
  
  // Update draftThesis on exampleThesisButton click
  $("#exampleThesisButton").on('click', function() {
    for (const key in draftThesis) {
      draftThesis[key] = exampleThesis[key];
    }
    $("#promptEntry").val(exampleThesis.prompt);
    $("#titleEntry").val(exampleThesis.title);
    $("#positionEntry").val(exampleThesis.position);
    $("#qualificationEntry").val(exampleThesis.qualification);
    $("#reasonEntry").val(exampleThesis.reason);
    $("#createThesisButton").prop('disabled', false);
  });

  // Update draftThesis.thesis on createThesisbutton click
  $("#createThesisButton").on('click', function() {
    draftThesis.thesis = draftThesis.qualification + " " + draftThesis.position + " " + draftThesis.reason;
    $("Section").slice(1).toggleClass("hidden"); // Note .hide() does not work
    $("#exampleThesisButton").prop('disabled', true);
    $("#titleDisplay").text(draftThesis.title);
    $("#promptDisplay").text(draftThesis.prompt);
    $("#thesisEntry").val(draftThesis.thesis);
    $("#step6").get(0).scrollIntoView();
  });

  // Go Back Button
  $("#backButton").on('click', function() {
    $("Section").slice(1).toggleClass("hidden");
    $("#exampleThesisButton").prop('disabled', false);
    $("#step1").get(0).scrollIntoView();
  });

  // Download Thesis Button
  // Font size is in half points
  // Line spacing is in twips (240ths of a line)
  $("#downloadButton").on('click', function() {
    // Creates the Doc
    const doc = new docx.Document({
      sections: [{
        children: [
          new docx.Paragraph({
            children: [new docx.TextRun({
              text: draftThesis.title,
              font: "Times New Roman",
              size: 24,
            })],
            alignment: docx.AlignmentType.CENTER,
            spacing: {
              line: 2 * 240,
            },
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({
              text: "\t" + draftThesis.thesis,
              font: "Times New Roman",
              size: 24,
            })],
            alignment: docx.AlignmentType.LEFT,
            spacing: {
              line: 2 * 240,
            },
          }),
        ],
      }],
    });
    // Saves the Doc
    docx.Packer.toBlob(doc).then(blob => {
      saveAs(blob, "thesis.docx");
    });
  });
})(jQuery);