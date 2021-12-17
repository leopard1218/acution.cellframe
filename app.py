from flask import Flask, json, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from web3 import Web3, HTTPProvider
from web3.middleware import geth_poa_middleware
from os import environ
import asyncio
from settings import PRIVATE_KEY


app = Flask(__name__)
# app.config.from_pyfile('settings.py')
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'cellframe'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)
CORS(app)

with open('./abi.json', 'r') as myfile:
    abi = myfile.read()
if PRIVATE_KEY != None:
    print(PRIVATE_KEY)
    url = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    w3 = Web3(HTTPProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'))
    address = w3.eth.account.privateKeyToAccount(PRIVATE_KEY).address
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    conAddress = '0xA4Edd8F39961969e98fcfd7B828A4393a703B48C'
    contract = w3.eth.contract(address=conAddress, abi=abi)
    currentBlockNum = w3.eth.block_number
    # print(currentBlockNum)
    # token = contract.functions.deployBlockNum().call()
    # print(token)
    with app.app_context():
        cur = mysql.connection.cursor()
        cur.execute("SELECT fromblock FROM block WHERE id='"+ str(1) +"'")
        
        result = cur.fetchall()
        fromblock = result[0]['fromblock']
        print(fromblock)

    event_filter = contract.events.Apply.createFilter(fromBlock = fromblock, toBlock = currentBlockNum).get_all_entries()
    print(len(event_filter))
    
# tx = {
#     'from': address,
#     'nonce': w3.eth.getTransactionCount(address),
#     'gas': 2000000,
#     'gasPrice': w3.toWei('50', 'gwei')
# }
# transaction = contract.functions.setAdmin('0x866D57dE7DcC015ad26e34965659cC169be697F3').buildTransaction(tx)  
# signed_txn = w3.eth.account.signTransaction(transaction, private_key=PRIVATE_KEY)
# tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
# w3.eth.waitForTransactionReceipt(tx_hash)
# print('Updated contract admin: {}'.format(
#     contract.functions.admin().call()
# ))
@app.route('/api/')
def active_acution_project():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM books")
    result = cur.fetchall()
    return jsonify(result)

# @app.route('/books', methods=['GET', 'POST'])
# def all_books():
#     if request.method == 'POST':
#         cur = mysql.connection.cursor()
#         title = request.get_json()['title']
#         author = request.get_json()['author']
#         temp = request.get_json()['read']
#         reading = 1 if temp else 0
#         cur.execute("INSERT INTO books(title, author, reading) VALUES('" +
#                     str(title)+"','"+str(author)+"','"+str(reading)+"')")
#         mysql.connection.commit()
#         result = {
#             'title': title,
#             'author': author,
#             'reading': reading
#         }
#     else:
#         cur = mysql.connection.cursor()
#         cur.execute("SELECT * FROM books")
#         result = cur.fetchall()
#     return jsonify(result)


# @app.route('/book/<id>', methods=['PUT', 'DELETE'])
# def single_book(id):
#     if request.method == 'DELETE':
#         cur = mysql.connection.cursor()
#         response = cur.execute("DELETE FROM books WHERE id='"+id+"'")
#         mysql.connection.commit()
#         if response > 0:
#             result = {'message': 'Record deleted successfully'}
#         else:
#             result = {'error': 'Record not found'}
#     else:
#         cur = mysql.connection.cursor()
#         title = request.get_json()['title']
#         author = request.get_json()['author']
#         temp = request.get_json()['read']
#         reading = 1 if temp else 0
#         cur.execute("UPDATE books SET title='"+str(title)+"', author='" +
#                     str(author)+"', reading='"+str(reading)+"' WHERE id='"+id+"'")
#         mysql.connection.commit()
#         result = {
#             'title': title,
#             'author': author,
#             'reading': reading
#         }
#     return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
