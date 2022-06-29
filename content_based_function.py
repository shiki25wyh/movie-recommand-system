import numpy as np
import pandas as pd
from scipy import spatial
from scipy import stats
from sklearn.metrics.pairwise import cosine_similarity
import random


def build_user_profile(user_id, user_preference_df, item_rep_vector, feature_list, weighted=True, normalized=True):
    
    

    ## A: Edit user preference (e.g., rating data) 
    user_preference_df = user_preference_df[user_preference_df['USER_ID'] == user_id]
    user_preference_df = user_preference_df[['MOVIE_ID','RATING']].copy(deep=True).reset_index(drop=True)
    ## B: Calculate item representation matrix to represent user profiles
    user_rating_df = pd.merge(user_preference_df, item_rep_vector, how = 'inner')
    
    
    ## if user do not rate before, randomly rate some movie
    while len(user_rating_df) == 0:
        fake_rating = []
        for index, row in item_rep_vector.iterrows():
            if random.randint(0,200) == 100:
                fake_rating.append({"MOVIE_ID": row['MOVIE_ID'], "RATING": random.randint(1,5)})
        user_preference_df = pd.DataFrame(fake_rating, columns=['MOVIE_ID', 'RATING'])
        user_rating_df = pd.merge(user_preference_df, item_rep_vector, how = 'inner')
            
            
            
    user_prefer_df = user_rating_df.copy(deep=True)
    user_prefer_df = user_prefer_df[feature_list]
    
    
    
    
    
    
    
    ## C: Aggregate item representation matrix
    rating_weight = len(user_rating_df)*[1]
    if weighted:
        rating_weight = user_rating_df.RATING / user_rating_df.RATING.sum()
        

    user_profile = user_prefer_df.T.dot(rating_weight)
    
    if normalized:
        user_profile = user_profile / sum(user_profile.values)
        
    return user_profile

def generate_recommendation_results(user_id, user_profile, item_rep_vector, item_rep_matrix, movie_df):
    # Comput the cosine similarity
    u_v = user_profile.values
    u_v_matrix =  [u_v]
    recommendation_table = cosine_similarity(u_v_matrix,item_rep_matrix)
    
    exist_movie_df = pd.merge(item_rep_vector, movie_df)
    
    recommendation_table_df = exist_movie_df[['MOVIE_ID', 'NAME']].copy(deep=True)
    recommendation_table_df['similarity'] = recommendation_table[0]
    rec_result = recommendation_table_df.sort_values(by=['similarity'], ascending=False)

    return rec_result

def get_recommendation_list(rec_result, k, user_id, rating_df):
    top_k_recommendation = []
    for rec_movie_id in rec_result.MOVIE_ID.values:
        if len(rating_df[(rating_df['USER_ID'] == user_id) & (rating_df['MOVIE_ID'] == rec_movie_id)]) == 0: 
            top_k_recommendation.append(rec_movie_id)
            if len(top_k_recommendation)==k:
                break
    return top_k_recommendation
    
def get_recommendation_list_remove_pre(rec_result, k, user_preference_df):
    top_k_recommendation = []
    movie_in_user_pre = user_preference_df.itemId.unique()
    for rec_movie_id in rec_result.MOVIE_ID.values:
        if rec_movie_id not in movie_in_user_pre:
            top_k_recommendation.append(rec_movie_id)
        if len(top_k_recommendation)==k:
            break
    return top_k_recommendation

def get_ground_truth_list(user_testing_df):

    true_rec_list = user_testing_df[user_testing_df['RATING'] >= 3].MOVIE_ID.values
    
    return true_rec_list


def precision_at_k(y_true_list, y_reco_list, users, k):
    precision_all = list()
    for u in users:
        y_true = y_true_list[u]
        y_reco = y_reco_list[u]
        common_items = set(y_reco).intersection(y_true)
        precision = len(common_items) / k
        precision_all.append(precision)
    return np.mean(precision_all)


def recall_at_k(y_true_list, y_reco_list, users, k):
    recall_all = list()
    for u in users:
        y_true = y_true_list[u]
        y_reco = y_reco_list[u]
        common_items = set(y_reco).intersection(y_true)
        recall = len(common_items) / len(y_true)
        recall_all.append(recall)
    return np.mean(recall_all)


def ndcg_at_k(y_true_list, y_reco_list, users, k):
    ndcg_all = list()
    for u in users:
        rank_list = np.zeros(k)
        y_true = list(set(y_true_list[u]))
        y_reco = y_reco_list[u]
        common_items, indices_in_true, indices_in_reco = np.intersect1d(
            y_true, y_reco, assume_unique=True, return_indices=True)

        if common_items.size > 0:
            rank_list[indices_in_reco] = 1
            ideal_list = np.sort(rank_list)[::-1]
            dcg = np.sum(rank_list / np.log2(np.arange(2, k + 2)))
            idcg = np.sum(ideal_list / np.log2(np.arange(2, k + 2)))
            ndcg = dcg / idcg
        else:
            ndcg = 0
        ndcg_all.append(ndcg)
    return np.mean(ndcg_all)

def evaluation(y_true_list, y_reco_list, users, k):
    precision_res = precision_at_k(y_true_list, y_reco_list, users, k)
    recall_res = recall_at_k(y_true_list, y_reco_list, users, k)
    ndcg_res = ndcg_at_k(y_true_list, y_reco_list, users, k)
    print("\tPrecision@",k, ':', precision_res)
    print("\tRecall@:",k, ':', recall_res )
    print("\tnDCG@:", k, ':', ndcg_res)
    
    return precision_res, recall_res, ndcg_res 