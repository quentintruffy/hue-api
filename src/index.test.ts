import { HueApi } from './hue-api';

main();

async function main() {
  const hueApi = new HueApi(
    '192.168.1.10',
    'rNtZSe4KSw9os57VE7BgHAkeThpxdwjItT6acmre'
  );

  const { errors, data } = await hueApi.getLights();
  if (errors.length > 0) {
    console.error(errors);
    return;
  }
  console.log(data);
}
