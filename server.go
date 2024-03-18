package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	_ "github.com/lib/pq"
)

const (
	dbConnectionString = "postgres://tannal:password@192.168.43.246:5432/exchange?sslmode=disable"
)

type RequestData struct {
	Query  string `json:"query"`
	Answer string `json:"answer"`
}

func insertData(db *sql.DB, query string, answer string) error {
	// Construct the SQL statement
	stmt := `INSERT INTO chat (query, answer) VALUES ($1, $2)`
	// Execute the SQL statement
	_, err := db.Exec(stmt, query, answer)
	return err
}

func searchHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers for the preflight request
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET")
			w.WriteHeader(http.StatusOK)
			return
		}

		// Set CORS headers for the main request
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// parse the url parameters
		query := r.URL.Query().Get("query")

		// search data from the database
		// SELECT * FROM chat WHERE query LIKE '%the%' OR answer LIKE '%the%';
		// rows, err := db.Query("SELECT query, answer FROM chat WHERE query iLIKE $1 OR answer iLIKE $2", "%"+query+"%", "%"+query+"%")

		// split the query with %20 ' '
		// then create a query with the split words
		keywords := strings.Split(query, " ")

		// log
		// fmt.Println(keywords)

		for i := 0; i < len(keywords); i++ {

			rows, err := db.Query("SELECT query, answer FROM chat WHERE query iLIKE $1 OR answer iLIKE $2", "%"+keywords[i]+"%", "%"+keywords[i]+"%")
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			for rows.Next() {
				var query string
				var answer string
				rows.Scan(&query, &answer)
				fmt.Fprintln(w, "Q:"+query)
				fmt.Fprintln(w, "A:"+answer)
			}
		}
		w.WriteHeader(http.StatusCreated)

		// for rows.Next() {
		// 	var query string
		// 	var answer string
		// 	rows.Scan(&query, &answer)
		// 	fmt.Fprintln(w, query, answer)
		// }
		// fmt.Fprintln(w, rows)
	}
}

func postHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers for the preflight request
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(http.StatusOK)
			return
		}

		// Set CORS headers for the main request
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Parse the request data
		var data RequestData
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Insert the data into the database
		if err := insertData(db, data.Query, data.Answer); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Send a success response
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintln(w, "Data inserted successfully")
	}
}

func shareHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers for the preflight request
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET")
			w.WriteHeader(http.StatusOK)
			return
		}

		// Set CORS headers for the main request
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// get the share url from the request
		shareURL := r.URL.Query().Get("url")

		// Get the data from the OpenAI chat page
		client := &http.Client{}
		req, err := http.NewRequest("GET", shareURL, nil)
		if err != nil {
			log.Fatal(err)
		}
		resp, err := client.Do(req)
		if err != nil {
			log.Fatal(err)
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err)
		}

		html := string(body)

		start := strings.LastIndex(html, ">{")

		end := strings.LastIndex(html, "}</script>")

		data := html[start+1 : end+1]

		var response Response
		err = json.Unmarshal([]byte(data), &response)
		if err != nil {
			panic(err)
		}

		var query string
		var answer string

		for i, linearConversation := range response.Props.PageProps.ServerResponse.Data.LinearConversation {
			for _, part := range response.Props.PageProps.ServerResponse.Data.Mapping[linearConversation.Id].Message.Content.Parts {
				if i%2 == 0 {
					query = part
				} else {
					answer = part
					fmt.Println(query, answer)
				}
			}
		}

		// Insert the data into the database
		if err := insertData(db, query, answer); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Send the data as the HTTP response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

func main() {
	// Connect to the PostgreSQL database
	db, err := sql.Open("postgres", dbConnectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Set up the HTTP handler for POST requests
	http.HandleFunc("/post", postHandler(db))

	http.HandleFunc("/search", searchHandler(db))

	http.HandleFunc("/share", shareHandler(db))

	// Start the HTTP server
	log.Fatal(http.ListenAndServe(":8081", nil))
}
