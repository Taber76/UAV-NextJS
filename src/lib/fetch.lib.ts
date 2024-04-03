class FetchLib {

  public static async get(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  public static async post(url: string, data: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const dataResp = await response.json();
      return dataResp;
    } catch (error) {
      console.error('Error:', error);
    }
  }

}

export default FetchLib