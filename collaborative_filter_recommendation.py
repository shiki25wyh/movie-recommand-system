from collections import defaultdict
from surprise import SVD
from surprise import Dataset
from surprise import accuracy
from surprise import Reader
from surprise import KNNWithMeans
from surprise import CoClustering
from surprise import SlopeOne
from surprise import SVDpp
from surprise.model_selection import train_test_split
from surprise.model_selection import cross_validate
from surprise.model_selection import GridSearchCV
import pandas as pd
import timeit



def item_based_KNN_algo_preparation(path, k):
    reader = Reader(line_format='user item rating', sep=',')
    data = Dataset.load_from_file(path, reader=reader)
    trainset = data.build_full_trainset()
    item_knn_algo = KNNWithMeans(k = k, sim_options={
        "name": "cosine",
        "user_based": False,
    })
    item_knn_algo.fit(trainset)
    return item_knn_algo, trainset


def item_based_KNN_for_user(user_id, item_knn_algo, trainset, k):
    similarity_matrix = item_knn_algo.compute_similarities()
    inner_u_id = trainset.to_inner_uid(user_id)
    test_subject_ratings = trainset.ur[inner_u_id]
    watched_movie = sorted(test_subject_ratings, reverse = True, key = lambda t: t[1])
    candidates = defaultdict(float)
    for itemID, rating in watched_movie:
        try:
            similarities = similarity_matrix[itemID]
            for innerID, score in enumerate(similarities):
                candidates[innerID] += score * (rating / 5.0)
        except:
            continue
  
    k_neighbors = sorted(candidates.items(), key=lambda x: x[1], reverse=True)

    watched = {}
    for itemID, rating in trainset.ur[inner_u_id]:
        watched[itemID] = 1

    recommendations = []
    position = 0
    for itemID, rating_sum in k_neighbors:
        if not itemID in watched:
            recommendations.append(trainset.to_raw_iid(itemID))
            position += 1
        if (position >= k): 
            break
    return recommendations


def item_based_KNN_for_item(item_id, item_knn_algo, trainset, k):
    similarity_matrix = item_knn_algo.compute_similarities()
    inner_i_id = trainset.to_inner_iid(item_id)
    candidates = defaultdict(float)
    similarities = similarity_matrix[inner_i_id]
    for innerID, score in enumerate(similarities):
        candidates[innerID] = score
    k_neighbors = sorted(candidates.items(), key=lambda x: x[1], reverse=True)
    recommendations = []
    position = 0
    for itemID, rating_sum in k_neighbors:
        if itemID != inner_i_id:
            recommendations.append(trainset.to_raw_iid(itemID))
            position += 1
        if (position >= k): 
            break
    return recommendations
                
                
                
  