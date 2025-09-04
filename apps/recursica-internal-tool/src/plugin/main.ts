figma.showUI(__html__, {
  width: 370,
  height: 350,
});

figma.ui.onmessage = (e) => {
  console.log(e);
};
