import fetch from "node-fetch";

async function testSubmit() {
  const payload = {
    requirementElicitation: {
      startTime: undefined,
      endTime: undefined,
      discussion: undefined
    },
    feature: {
      featureName: undefined,
      featureDescription: {
        startTime: undefined,
        endTime: undefined,
        requirementAnalysis: undefined
      }
    },
    featureEstimate: {
      userStoryDistribution: []
    },
    trackingAndReleaseDetails: [
      {
        userStoryNumber: "",
        userStoryLink: "",
        prLinks: [],
        codeDescription: "",
        pipelineBuildLinks: [],
        environmentDeployLinks: []
      }
    ],
    whoCreatedIt: {
      name: undefined,
      empId: undefined,
      totalTime: 0
    },
    retrospectiveSection: []
  };

  try {
    const res = await fetch("http://localhost:5000/api/documentation/submit/66347f4f9f1b9b0012345678", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (err) {
    console.error(err);
  }
}

testSubmit();
