export const colors = ['gray', 'darkgray', '#754068','#6a707a70'];
let counter = 0;
export const getPlayerColor = () => colors[counter++ % colors.length];
//TODO(write test)
