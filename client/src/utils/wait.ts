function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function getData(data: any): Promise<any> {
  return wait(3000).then(() => {
    return data;
  });
}
