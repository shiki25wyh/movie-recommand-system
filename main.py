from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates 
from fastapi.staticfiles import StaticFiles 
from fastapi import Request   

import collaborative_filter_recommendation as cf
import content_based_recommendation as cb
import tokenConfig as tk
import pandas as pd
import json




class reqUser(BaseModel):
    name: str
    password: str

### status 100：注册成功
### status 101：注册失败
### status 110：登陆成功
### status 111: 登陆失败
class respUser(BaseModel):
    status: int
    msg: str
    token: Optional[str] = None

### scores = [{"movie_id":1,"score":2},{"movie_id":2,"score":3}]
class reqScore(BaseModel):
    token: str
    scores: list = []

### status 200：操作成功
### status 201：操作失败
class respScore(BaseModel):
    status: int
    msg: str


### status 300：操作成功
### status 301：操作成功,但无结果
### status 303：操作失败
### recommentation: 一个json list转化后的字符串， 格式：
##["{'MOVIE_ID': 26292844, 'NAME': '血屠杀惨案', 'ALIAS': nan, 'ACTORS': nan, 'COVER': nan, 'DIRECTORS': nan, 'DOUBAN_SCORE': 0.0, 'DOUBAN_VOTES': 0.0, 'GENRES': '惊悚/恐怖', 'IMDB_ID': 'tt2551510', 'LANGUAGES': '英语', 'MINS': 125.0, 'OFFICIAL_SITE': nan, 'REGIONS': '美国', 'RELEASE_DATE': nan, 'SLUG': 'AeaERuaEf', 'STORYLINE': nan, 'TAGS': '恐怖/血腥/犯罪/杀戮/惊悚/暴力/国外电影/美国电影', 'YEAR': 2013.0, 'ACTOR_IDS': nan, 'DIRECTOR_IDS': nan}", 
# "{'MOVIE_ID': 24736501, 'NAME': '残酷噩梦', 'ALIAS': '残酷噩梦(台) / 南荒邪教大本营(港)', 'ACTORS': nan, 'COVER': nan, 'DIRECTORS': nan, 'DOUBAN_SCORE': 6.5, 'DOUBAN_VOTES': 52.0, 'GENRES': '惊悚/恐怖', 'IMDB_ID': 'tt3063586', 'LANGUAGES': '英语', 'MINS': 82.0, 'OFFICIAL_SITE': nan, 'REGIONS': '德国', 'RELEASE_DATE': nan, 'SLUG': 'uUBYvUnVf', 'STORYLINE': '剧情/科幻/惊悚/恐怖', 'TAGS': '血腥/恐怖/恐怖电影/虐待/德国/血浆/血女/诡异', 'YEAR': 2010.0, 'ACTOR_IDS': nan, 'DIRECTOR_IDS': nan}"]
class respRecommmendation(BaseModel):
    status: int
    msg: str
    recommendation: list = []


### preparation
movie_feature_path = './data/movie_for_calc_refined.csv'
movie_path = './data/movies.csv'
rating_path = './data/ratings.csv'
suprise_rating_path = './data/rating_for_surprise.csv'
user_path = './data/user.csv'
# movie_feature_df = pd.read_csv(movie_feature_path)
# movie_df = pd.read_csv(movie_path)
# rating_df = pd.read_csv(rating_path)
# item_based_algo, trainset = cf.item_based_KNN_algo_preparation(suprise_rating_path, 250)


###preparation for user file


print("prepare finish!")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



##static
pages = Jinja2Templates(directory="pages")
app.mount('/js', StaticFiles(directory='pages/js'), name='static')
app.mount('/css', StaticFiles(directory='pages/css'), name='static')
app.mount('/img', StaticFiles(directory='pages/img'), name='static')
app.mount('/pic', StaticFiles(directory='pages/pic'), name='static')

@app.get("/{page}.html")
async def main(request: Request, page):
    html = page+".html"
    return pages.TemplateResponse(html, {'request': request})



@app.post("/register")
async def register(user: reqUser):
    res = respUser
    user_list = pd.read_csv(user_path)
    try:
        if len(user_list[user_list['name'] == user.name]) == 0:
            res.status = 100
            res.msg = "注册成功"
            new_token = tk.generate_token(user.name)
            res.token = new_token
            userinfo = {'name': user.name, 'password': user.password, 'token': new_token}
            user_info = pd.DataFrame(userinfo, index = [0])
            user_list = user_list.append(user_info,ignore_index=True)
            user_list.to_csv(user_path, index=False,encoding='utf-8')
        else:
            res.status = 101
            res.msg = "注册失败，该用户已注册"
            res.token = ""
            user_list.head(10)
    except:
        res.status = 500
        res.msg = "服务器错误"
        res.token = ""
    return {"status": res.status, "msg": res.msg, "token": res.token}


@app.post("/login")
async def login(user: reqUser):
    res = respUser
    user_list = pd.read_csv(user_path)
    try:
        if len(user_list[(user_list['name'] == user.name) & (user_list['password'] == user.password)]) == 1:
            res.status = 110
            res.msg = "登陆成功"
            new_token = tk.generate_token(user.name)
            res.token = new_token
            for index, row in user_list.iterrows():
                if row['name'] == user.name:
                    user_list.at[index, 'token'] = new_token
                    break
            user_list.to_csv(user_path, index=False,encoding='utf-8')
        else:
            res.status = 111
            res.msg = "登陆失败"
            res.token = ""
    except:
        res.status = 500
        res.msg = "服务器错误"
        res.token = ""
    return {"status": res.status, "msg": res.msg, "token": res.token}



@app.get("/search/{keyword}")
async def search(keyword):
    res = respRecommmendation
    try:
        movie_df = pd.read_csv(movie_path)
        movie_df = movie_df.fillna("")
        list = []
        for index, row in movie_df.iterrows():
            if keyword in row['NAME']:
                list.append(dict_to_JSON_Str(row.to_dict()))

        res.status = 300
        res.msg = "操作成功"
        res.recommendation = list
    except:
        res.status = 500
        res.msg = "服务器错误"
        res.recommendation = []
    return {"status": res.status, "msg": res.msg, "recommendation": res.recommendation}

    



@app.post("/score")
async def score(req: reqScore):
    res = respScore
    try:
        user_list = pd.read_csv(user_path)
        name, find = get_name_by_token(user_list, req.token)
        if find:
            ratings = []
            for score_info in req.scores:
                ratings.append({"USER_ID": name, "MOVIE_ID": score_info['movie_id'], "RATING": score_info['score']})
        
            new_ratings = pd.DataFrame(ratings, columns=['USER_ID', 'MOVIE_ID', 'RATING'])
            
            rating_df = pd.read_csv(rating_path)
            rating_df = rating_df.append(new_ratings,ignore_index=True)
            rating_df.reset_index()
            rating_df.to_csv(rating_path, index=False,encoding='utf-8')
            surprise_rating_df = pd.read_csv(suprise_rating_path, names=['USER_ID', 'MOVIE_ID', 'RATING'])
            surprise_rating_df = surprise_rating_df.append(new_ratings,ignore_index=True)
            surprise_rating_df.reset_index()
            surprise_rating_df.to_csv(suprise_rating_path, index=False,encoding='utf-8', header = 0)
            res.status = 200
            res.msg = "操作成功"
        else:
            res.status = 201
            res.msg = "未认证用户"
        
    except:
        res.status = 500
        res.msg = "服务器错误"
    return {"status": res.status, "msg": res.msg}



@app.get("/knn/user/{token}/{recommend_number_str}")
async def knn_user(token, recommend_number_str):
    res = respRecommmendation
    try:
        user_list = pd.read_csv(user_path)
        name, find = get_name_by_token(user_list, token)
        if find:
            # name = str(name)
            surprise_rating_df = pd.read_csv(suprise_rating_path,  names=['USER_ID', 'MOVIE_ID', 'RATING'])
            if len(surprise_rating_df[surprise_rating_df['USER_ID'] == name]) == 0:
                res.status = 301
                res.msg = "操作成功,但无结果"
                res.recommendation = []
            else:
                recommend_number = 10
                if len(recommend_number_str) > 0:
                    recommend_number = int(recommend_number_str)
                item_based_algo, trainset = cf.item_based_KNN_algo_preparation(suprise_rating_path, 10)
                movie_df = pd.read_csv(movie_path)
                recommend_list = cf.item_based_KNN_for_user(name, item_based_algo, trainset, recommend_number)
                recommendation = find_movie_list(movie_df, recommend_list)
                res.status = 300
                res.msg = "操作成功"
                res.recommendation = recommendation
        else:
            res.status = 302
            res.msg = "未认证用户"
            res.recommendation = []
        
    except:
        res.status = 500
        res.msg = "服务器错误"
        res.recommendation = []
    return {"status": res.status, "msg": res.msg, "recommendation": res.recommendation}

@app.get("/knn/movie/{movie_id}/{recommend_number_str}")
async def knn_movie(movie_id, recommend_number_str):
    res = respRecommmendation
    try:
        movie_pd = pd.read_csv(movie_path)
        movie_info = find_movie_list(movie_pd, [movie_id])
        if len(movie_info) == 0: 
                res.status = 301
                res.msg = "操作成功,但无结果"
                res.recommendation = []
        else: 
            recommend_number = 10
            if len(recommend_number_str) > 0:
                recommend_number = int(recommend_number_str)
            item_based_algo, trainset = cf.item_based_KNN_algo_preparation(suprise_rating_path, 250)
            recommend_list = cf.item_based_KNN_for_item(movie_id, item_based_algo, trainset, recommend_number)
            movie_df = pd.read_csv(movie_path)
            recommendation = find_movie_list(movie_df, recommend_list)
            res.status = 300
            res.msg = "操作成功"
            res.recommendation = recommendation
        
    except:
        res.status = 500
        res.msg = "服务器错误"
        res.recommendation = []
    return {"status": res.status, "msg": res.msg, "recommendation": res.recommendation}



@app.get("/contentbased/{token}/{recommend_number_str}")
async def content_based(token, recommend_number_str):
    res = respRecommmendation
    try:
        user_list = pd.read_csv(user_path)
        print(user_list)
        name, find = get_name_by_token(user_list, token)
        if find:
            recommend_number = 10
            if len(recommend_number_str) > 0:
                recommend_number = int(recommend_number_str)
            movie_feature_df = pd.read_csv(movie_feature_path)
            movie_df = pd.read_csv(movie_path)
            rating_df = pd.read_csv(rating_path)
            recommend_list = recommend_list = cb.content_based_recommend(name, movie_feature_df, movie_df, rating_df, recommend_number)
            movie_df = pd.read_csv(movie_path)
            recommendation = find_movie_list(movie_df, recommend_list)
            res.status = 300
            res.msg = "操作成功"
            res.recommendation = recommendation
        else:
            res.status = 302
            res.msg = "未认证用户"
            res.recommendation = []
        
    except:
        res.status = 500
        res.msg = "服务器错误"
        res.recommendation = []
    return {"status": res.status, "msg": res.msg, "recommendation": res.recommendation}


def get_name_by_token(user_list, token):
    for index, row in user_list.iterrows():
        if row['token'] == token:
            return row['name'], True
    return "", False

def find_movie_list(movie_df, movie_list):
    movie_df = movie_df.fillna("")
    recommendation = []
    for movie_id in movie_list:
        movies = movie_df[movie_df["MOVIE_ID"] == int(movie_id)]
        for movie in movies.to_dict('records'):
            recommendation.append(dict_to_JSON_Str(movie))
    return recommendation

def dict_to_JSON_Str(dictionary):
    for key, value in dictionary.items():
        dictionary[key] = str(value)
    return json.dumps(dictionary, ensure_ascii=False)