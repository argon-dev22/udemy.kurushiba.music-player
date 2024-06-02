import axios from "axios";

const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

class SpotifyClient {
  // メンバ変数（フィールド）の定義
  // let token;（JSでは省略可能）

  // メンバメソッドの定義
  static async initialize() {
    // アクセストークンを取得するためのリクエスト
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "client_credentials",
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const spotify = new SpotifyClient();
    spotify.token = res.data.access_token;
    return spotify;
  }

  async getPopularSongs() {
    // 本来ならAPIを叩くだけでサーバーにアクセスできていたものを、適切なアクセストークンを以下のように含めないとアクセスできない。
    const res = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe",
      {
        headers: {
          Authorization: "Bearer" + " " + this.token,
        },
      }
    );
    return res.data;
  }

  async searchSongs(keyword, limit, offset) {
    const res = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: "Bearer" + " " + this.token,
      },
      params: {
        q: keyword, // 検索キーワード
        type: "track", // 曲のデータのみを取得
        limit: limit, // 一度に取得するデータ数
        offset: offset, // 何個目のデータから取得するか
        // 例：limit=20, offset=15: 15～35個目のデータを取得
      },
    });
    return res.data.tracks;
  }

  printToken() {
    console.log(this.token);
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;
