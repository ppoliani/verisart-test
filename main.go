package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"
)

type Timestamp struct {
	Operator string
	Prefix string 
	Postfix string 
}


func getOperator(op string) func(data []byte) [32]byte {
	switch op {
	case "sha256": 
		return sha256.Sum256
	default:
		panic("Operator not supported!")
	}
}

func convertToString(v [32]byte) string {
	return hex.EncodeToString(v[:])
}

func fromHex(str string) []byte {
	val, _ := hex.DecodeString(str)

	return val;
}

func convertToBigEndian(message string) string {
	result := fromHex(message)
	reversed := []byte{}

	for i := range result {
		n := result[len(result)-1-i]
		reversed = append(reversed, n)
	}

	return hex.EncodeToString(reversed)
}

// This function should walk through the timestamps and verify message against merkleRoot
// Hints: use crypto/sha256 and encoding/hex. message is big-endian while merkleRoot is little-endian.
func VerifyHash(timestamps []Timestamp, message string, merkleRoot string) bool {
	if len(timestamps) == 0 {
		return strings.EqualFold(convertToBigEndian(message), merkleRoot)
	}

	timestamp, timestamps := timestamps[0], timestamps[1:]
	op := getOperator(timestamp.Operator)
	nextMsg := op(append(append(fromHex(timestamp.Prefix), fromHex(message)...), fromHex(timestamp.Postfix)...))

	return VerifyHash(timestamps, fmt.Sprintf("%x", nextMsg), merkleRoot)
}

func convertTuplesToTimestamps(tuples [][]string) []Timestamp {
	s := []Timestamp {}
	for _, elem := range tuples {
		s = append(s, Timestamp{elem[0], elem[1], elem[2]})
	}

	return s
}

func main(){
	msg := "b4759e820cb549c53c755e5905c744f73605f8f6437ae7884252a5f204c8c6e6"
	merkleRoot := "f832e7458a6140ef22c6bc1743f09610281f66a1b202e7b4d278b83de55ef58c"

	filePath := "./timestamp.json"
	dat, err := ioutil.ReadFile(filePath)
	if err != nil {
		return
	}

	tuples := [][]string{}
	// timestamps := []Timestamp{}

	// Convert byte slice to slice of tuples
	json.Unmarshal(dat, &tuples)

	if VerifyHash(convertTuplesToTimestamps(tuples), msg, merkleRoot) == true {
		fmt.Println("CORRECT!")
	} else {
		fmt.Println("INCORRECT!")
	}
}
