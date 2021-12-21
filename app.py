from flask import Flask, json, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from web3 import Web3, HTTPProvider
from web3.middleware import geth_poa_middleware
from os import environ
import asyncio
from settings import PRIVATE_KEY
import threading
from threading import Timer
app = Flask(__name__)
# app.config.from_pyfile('settings.py')
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'cellframe'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)
CORS(app)

with open('./abi_chain1.json', 'r') as myfile:
    abi_chain1 = myfile.read()
run = True

with open('./abi_chain2.json', 'r') as myfile:
    abi_chain2 = myfile.read()
run = True

with open('./abi_chain3.json', 'r') as myfile:
    abi_chain3 = myfile.read()
run = True

chainBlock1 = 1
chainBlock2 = 2
chainBlock3 = 3
if PRIVATE_KEY != None:
    # print(PRIVATE_KEY)
    url_chain1 = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    w3_chain1 = Web3(HTTPProvider(url_chain1))
    address = w3_chain1.eth.account.privateKeyToAccount(PRIVATE_KEY).address
    w3_chain1.middleware_onion.inject(geth_poa_middleware, layer=0)
    conAddress_chain1 = '0x1199FC12f5208e4a37E2d272B073F6D5919eE54f'
    # conAddress = '0x7db1d851A842bE7745dAa2F2aa7181E5557cAC24'
    contract_chain1 = w3_chain1.eth.contract(
        address=conAddress_chain1, abi=abi_chain1)

    url_chain2 = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    w3_chain2 = Web3(HTTPProvider(url_chain2))
    w3_chain2.middleware_onion.inject(geth_poa_middleware, layer=0)
    conAddress_chain2 = '0x33c3967b0aC382e7CccA779645cb8d4288835E3b'
    # conAddress = '0x7db1d851A842bE7745dAa2F2aa7181E5557cAC24'
    contract_chain2 = w3_chain2.eth.contract(
        address=conAddress_chain2, abi=abi_chain2)
    # token = contract_chain2.functions.deployBlockNum().call()
    # print(token)

    url_chain3 = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    w3_chain3 = Web3(HTTPProvider(url_chain3))
    w3_chain3.middleware_onion.inject(geth_poa_middleware, layer=0)
    conAddress_chain3 = '0x401FaD6879ef8ca967A9982F93a9793D4034B533'
    # conAddress = '0x7db1d851A842bE7745dAa2F2aa7181E5557cAC24'
    contract_chain3 = w3_chain3.eth.contract(
        address=conAddress_chain3, abi=abi_chain3)

    tx = {
        'from': address,
        'nonce': w3_chain3.eth.getTransactionCount(address),
        'gas': 2000000,
        'gasPrice': w3_chain3.toWei('50', 'gwei')
    }
    # # transaction = contract.functions.setAdmin('0x866D57dE7DcC015ad26e34965659cC169be697F3').buildTransaction(tx)
    # transaction = contract.functions.applyTo(3, 'Flask', True, 1, 8, 'http://aaa', 'CELL', '0x421E4fDD21AA4100C43CF29e0b30DBf3Ea1A90fC').buildTransaction(tx)
    # signed_txn = w3.eth.account.signTransaction(transaction, private_key=PRIVATE_KEY)
    # tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
    # w3.eth.waitForTransactionReceipt(tx_hash)
    # print('Updated contract admin: {}'.format(
    #     contract.functions.admin().call()
    # ))

    def rinkebyScan():
        global run
        if run:
            with app.app_context():
                cur = mysql.connection.cursor()
                cur.execute(
                    "SELECT fromblock FROM block WHERE id='" + str(chainBlock1) + "'")

                result = cur.fetchall()
                fromblock = result[0]['fromblock']
                print(fromblock)
            currentBlockNum = w3_chain1.eth.block_number
            apply_filter = contract_chain1.events.Apply.createFilter(
                fromBlock=fromblock + 1, toBlock=currentBlockNum).get_all_entries()
            bid_filter = contract_chain1.events.BID.createFilter(
                fromBlock=fromblock + 1, toBlock=currentBlockNum).get_all_entries()
            with app.app_context():
                cur = mysql.connection.cursor()
                cur.execute("UPDATE block SET fromblock = '" + str(currentBlockNum) +
                            "'" + "WHERE id ='" + str(chainBlock1) + "'")
                mysql.connection.commit()
            if(len(apply_filter) > 0):
                for apply in apply_filter:
                    auctionID = apply['args']['auctionID']
                    owner = apply['args']['participant']
                    projectName = str(apply['args']['project_name'].decode(
                        'utf-8')).replace('\x00', '')
                    crowdloan = apply['args']['project_type']
                    st_range = apply['args']['st_range']
                    end_range = apply['args']['end_range']
                    referenceUrl = str(apply['args']['metaURI'].decode(
                        'utf-8')).replace('\x00', '')
                    tokenName = str(apply['args']['token_name'].decode(
                        'utf-8')).replace('\x00', '')
                    tokenAddr = apply['args']['sc_address']

                    print(auctionID, owner, projectName, crowdloan, st_range,
                          end_range, referenceUrl, tokenName, tokenAddr)
                    with app.app_context():
                        cur = mysql.connection.cursor()
                        cur.execute("INSERT INTO project(auctionID, owner, projectName, crowdloan, st_range, end_range, referenceUrl, tokenName, tokenaddr, isApproved, chainId, totalScore) VALUES('" +
                                    str(auctionID)+"','"+str(owner)+"','"+str(projectName)+"','" + str(crowdloan)+"','" + str(st_range)+"','" + str(end_range)+"','" + str(referenceUrl)+"','" +
                                    str(tokenName)+"','" + str(tokenAddr)+"','" + str(0) + "','" + str(4)+"','" + str(0) + "')")
                        mysql.connection.commit()
            if(len(bid_filter) > 0):
                for bid in bid_filter:
                    projectID = bid['args']['projectID']
                    bidder = bid['args']['bidder']
                    timestamp = bid['args']['timestamp']
                    amount = bid['args']['amount']
                    st_range = bid['args']['st_range']
                    end_range = bid['args']['end_range']
                    tokenAddress = bid['args']['tokenAddress']

                    print(projectID, bidder, timestamp, amount,
                          st_range, end_range, tokenAddress)
                    with app.app_context():
                        cur = mysql.connection.cursor()
                        cur.execute("INSERT INTO bidder(projectID, bidder, timestamp, amount, st_range, end_range, tokenAddress) VALUES('" +
                                    str(projectID)+"','"+str(bidder)+"','"+str(timestamp)+"','" + str(amount)+"','" + str(st_range)+"','" +
                                    str(end_range)+"','" + str(tokenAddress) + "')")
                        mysql.connection.commit()
                        cur.execute(
                            "SELECT auctionID, chainId FROM project WHERE id='" + str(projectID) + "'")
                        result = cur.fetchall()
                        auctionID = result[0]['auctionID']
                        chainId = result[0]['chainId']
                    transaction = contract_chain3.functions.applyTo(
                        auctionID, projectID, bidder, timestamp, chainId, tokenAddress, amount).buildTransaction(tx)
                    signed_txn = w3_chain3.eth.account.signTransaction(
                        transaction, private_key=PRIVATE_KEY)
                    tx_hash = w3_chain3.eth.sendRawTransaction(
                        signed_txn.rawTransaction)
                    w3_chain3.eth.waitForTransactionReceipt(tx_hash)
            Timer(10, rinkebyScan).start()
    rinkebyScan()

    def ropstenScan():
        global run
        if run:
            with app.app_context():
                cur = mysql.connection.cursor()
                cur.execute(
                    "SELECT fromblock FROM block WHERE id='" + str(2) + "'")

                result = cur.fetchall()
                fromblock = result[0]['fromblock']
                print(fromblock)
            currentBlockNum = w3_chain2.eth.block_number
            apply_filter = contract_chain2.events.Apply.createFilter(
                fromBlock=fromblock + 1, toBlock=currentBlockNum).get_all_entries()
            bid_filter = contract_chain1.events.BID.createFilter(
                fromBlock=fromblock + 1, toBlock=currentBlockNum).get_all_entries()
            with app.app_context():
                cur = mysql.connection.cursor()
                cur.execute("UPDATE block SET fromblock = '" + str(currentBlockNum) +
                            "'" + "WHERE id ='" + str(chainBlock2) + "'")
                mysql.connection.commit()
            if(len(apply_filter) > 0):
                for apply in apply_filter:
                    auctionID = apply['args']['auctionID']
                    owner = apply['args']['participant']
                    projectName = str(apply['args']['project_name'].decode(
                        'utf-8')).replace('\x00', '')
                    crowdloan = apply['args']['project_type']
                    st_range = apply['args']['st_range']
                    end_range = apply['args']['end_range']
                    referenceUrl = str(apply['args']['metaURI'].decode(
                        'utf-8')).replace('\x00', '')
                    tokenName = str(apply['args']['token_name'].decode(
                        'utf-8')).replace('\x00', '')
                    tokenAddr = apply['args']['sc_address']

                    print(auctionID, owner, projectName, crowdloan, st_range,
                          end_range, referenceUrl, tokenName, tokenAddr)
                    with app.app_context():
                        cur = mysql.connection.cursor()
                        cur.execute("INSERT INTO project(auctionID, owner, projectName, crowdloan, st_range, end_range, referenceUrl, tokenName, tokenaddr, isApproved, chainId, totalScore) VALUES('" +
                                    str(auctionID)+"','"+str(owner)+"','"+str(projectName)+"','" + str(crowdloan)+"','" + str(st_range)+"','" + str(end_range)+"','" + str(referenceUrl)+"','" +
                                    str(tokenName)+"','" + str(tokenAddr)+"','" + str(0) + "','" + str(4)+"','" + str(0) + "')")
                        mysql.connection.commit()
            if(len(bid_filter) > 0):
                for bid in bid_filter:
                    projectID = bid['args']['projectID']
                    bidder = bid['args']['bidder']
                    timestamp = bid['args']['timestamp']
                    amount = bid['args']['amount']
                    st_range = bid['args']['st_range']
                    end_range = bid['args']['end_range']
                    tokenAddress = bid['args']['tokenAddress']

                    print(projectID, bidder, timestamp, amount,
                          st_range, end_range, tokenAddress)
                    with app.app_context():
                        cur = mysql.connection.cursor()
                        cur.execute("INSERT INTO bidder(projectID, bidder, timestamp, amount, st_range, end_range, tokenAddress) VALUES('" +
                                    str(projectID)+"','"+str(bidder)+"','"+str(timestamp)+"','" + str(amount)+"','" + str(st_range)+"','" +
                                    str(end_range)+"','" + str(tokenAddress) + "')")
                        mysql.connection.commit()
            Timer(10, ropstenScan).start()
    ropstenScan()


@app.route('/api/getActiveAuctionUser', methods=['GET'])
def getActiveAuctionUser():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM auction WHERE activeState='" + str(1) + "'")
        result = cur.fetchall()
        print(result[0]['id'])
        if(len(result) > 0):
            cur.execute("SELECT * FROM project WHERE auctionID='" +
                        str(result[0]['id']) + "'" + "and isApproved='" + str(1) + "'")
            result1 = cur.fetchall()
            result[0]['applicants'] = result1
            # print(result)
            return jsonify(result)
        else:
            return 'no data'


@app.route('/api/getActiveAuctionAdmin', methods=['GET'])
def getActiveAuctionAdmin():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM auction WHERE activeState='" + str(1) + "'")
        result = cur.fetchall()
        print(result[0]['id'])
        if(len(result) > 0):
            cur.execute("SELECT * FROM project WHERE auctionID='" +
                        str(result[0]['id']) + "'")
            result1 = cur.fetchall()
            result[0]['applicants'] = result1
            # print(result)
            return jsonify(result)
        else:
            return 'no data'


@app.route('/api/getFutureAuctionUser', methods=['GET'])
def getFutureAuctionUser():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM auction WHERE activeState='" + str(2) + "'")
        result = cur.fetchall()
        print(result[0]['id'])
        if(len(result) > 0):
            cur.execute("SELECT * FROM project WHERE auctionID='" +
                        str(result[0]['id']) + "'" + "and isApproved='1'")
            result1 = cur.fetchall()
            result[0]['project'] = result1
            # print(result)
            return jsonify(result)
        else:
            return 'no data'


@app.route('/api/getFutureAuctionAdmin', methods=['GET'])
def getFutureAuctionAdmin():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM auction WHERE activeState='" + str(2) + "'")
        result = cur.fetchall()
        print(result[0]['id'])
        if(len(result) > 0):
            cur.execute("SELECT * FROM project WHERE auctionID='" +
                        str(result[0]['id']) + "'")
            result1 = cur.fetchall()
            result[0]['project'] = result1
            # print(result)
            return jsonify(result)
        else:
            return 'no data'


@app.route('/api/createactiveauction', methods=['POST'])
def createActiveAuction():
    if request.method == 'POST':
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM auction WHERE activeState='" + str(1) + "'")
        result = cur.fetchall()
        if(len(result) == 0):
            cur.execute("SELECT * FROM auction WHERE activeState='" + str(2) + "'")
            result = cur.fetchall()
            print(request.get_json())
            if(len(result) > 0):
                cur.execute(
                    "UPDATE auction SET activeState = 1 WHERE activeState = 2")
            else:
                maxRange = request.get_json()['maxRange']
                minScore = request.get_json()['minimalCellSlotPrice']
                cur.execute("INSERT INTO auction(maxRange, minScore, activeState, auctionState) VALUES('" +
                            str(maxRange)+"','"+str(minScore)+"','"+str(1)+"','" + str(0)+"')")
                mysql.connection.commit()
                result = {
                    'maxRange': maxRange,
                    'minimalCellSlotPrice': minScore
                }
                print(result)
    return jsonify(result)


@app.route('/api/createfutureauction', methods=['POST'])
def createFutureAuction():
    if request.method == 'POST':
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM auction WHERE activeState='" + str(2) + "'")
        result = cur.fetchall()
        # print(len(result))
        if(len(result) > 0):
            return 'already exist'
        else: 
            maxRange = request.get_json()['maxRange']
            minScore = request.get_json()['minimalCellSlotPrice']
            cur.execute("INSERT INTO auction(maxRange, minScore, activeState, auctionState) VALUES('" +
                        str(maxRange)+"','"+str(minScore)+"','"+str(2)+"','" + str(0)+"')")
            mysql.connection.commit()
            result = {
                'maxRange': maxRange,
                'minimalCellSlotPrice': minScore
            }
            print(result)
            return jsonify(result)
@app.route('/api/startAuction', methods=['GET'])
def startAuction():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        maxRange = request.get_json()['maxRange']
        minScore = request.get_json()['minimalCellSlotPrice']
        cur.execute("INSERT INTO auction(maxRange, minScore, activeState, auctionState) VALUES('" +
                    str(maxRange)+"','"+str(minScore)+"','"+str(2)+"','" + str(0)+"')")
        mysql.connection.commit()
        result = {
            'maxRange': maxRange,
            'minimalCellSlotPrice': minScore
        }
        print(result)
    return jsonify(result)


@app.route('/api/finishAuction', methods=['GET'])
def finishAuction():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        maxRange = request.get_json()['maxRange']
        minScore = request.get_json()['minimalCellSlotPrice']
        cur.execute("INSERT INTO auction(maxRange, minScore, activeState, auctionState) VALUES('" +
                    str(maxRange)+"','"+str(minScore)+"','"+str(2)+"','" + str(0)+"')")
        mysql.connection.commit()
        result = {
            'maxRange': maxRange,
            'minimalCellSlotPrice': minScore
        }
        print(result)
    return jsonify(result)


if __name__ == '__main__':
    app.run(host='192.168.104.30', debug=True)
