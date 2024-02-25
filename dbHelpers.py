import pymongo

myClient = pymongo.MongoClient("mongodb://localhost:27017")

db = myClient["StartupAnalysis"]
startups = db["startups"]

def insert_thread(startup_data):
    try:
        startups.insert_one(startup_data)
        return 1
    except Exception as e:
        print(e)
        return 0
    
def get_all_thread():
    try:
        result=startups.find({},{'_id': 0})        
        return list(result)
    except Exception as e:
        print(str(e))
        return []
    
def find_one_thread(thread_id):
    try:
        result=startups.find_one({"thread_id": thread_id})
        return result
    except Exception as e:
        print(f'Error in finding the data for id {thread_id}')
        print(str(e))
        return None