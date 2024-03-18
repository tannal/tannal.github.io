package main

type Response struct {
	// {"props":{"pageProps":{"serverPrimedAllowBrowserStorageValue":true,"isStorageComplianceEnabled":false,"sharedConversationId":"d131de93-ade0-49b7-a29f-a2264aa35ffd","serverResponse":{"type":"data","data":{"title":"Create Chat Table PostgreSQL.","create_time":1709709636.141682,"update_time":1709709638,"mapping":{"80c4132e-ff66-43c6-b55a-732105770976":{"id":"80c4132e-ff66-43c6-b55a-732105770976","message":{"id":"80c4132e-ff66-43c6-b55a-732105770976","author":{"role":"assistant","metadata":{}},"create_time":1709709064.492545,"content":{"content_type":"text","parts":["The SQL statement you provided is mostly correct for creating a table in a PostgreSQL database, but with a slight adjustment needed for the `AUTO_INCREMENT` attribute, as PostgreSQL uses the `SERIAL` or `BIGSERIAL` data type for auto-incrementing integer values. Here's the adjusted SQL statement to create a table named `chat` in PostgreSQL:\n\n```sql\nCREATE TABLE chat (\n  id SERIAL PRIMARY KEY,\n  query TEXT,\n  answer TEXT\n);\n```\n\nIn this statement:\n- `id` is set as an auto-incrementing integer using `SERIAL`, which is suitable for most cases. If you expect the table to have a very large number of rows, consider using `BIGSERIAL` instead.\n- `PRIMARY KEY` designates the `id` column as the primary key.\n- The `query` and `answer` columns are set to store text data."]},"status":"finished_successfully","end_turn":true,"weight":1,"metadata":{"finish_details":{"type":"stop","stop_tokens":[100260]},"citations":[],"is_complete":true,"model_slug":"gpt-4","parent_id":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","request_id":"8600870cfd874036-SIN","timestamp_":"absolute","shared_conversation_id":"d131de93-ade0-49b7-a29f-a2264aa35ffd"},"recipient":"all"},"parent":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","children":[]},"aaa22c02-ca4f-42e3-a0cf-38357de4fc33":{"id":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","message":{"id":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","author":{"role":"user","metadata":{}},"create_time":1709709042.976143,"content":{"content_type":"text","parts":["CREATE TABLE chat (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  query TEXT,\n  answer TEXT\n);\n\npostgresql create"]},"status":"finished_successfully","weight":1,"metadata":{"request_id":"8600870cfd874036-SIN","timestamp_":"absolute","shared_conversation_id":"d131de93-ade0-49b7-a29f-a2264aa35ffd"},"recipient":"all"},"parent":"9529e436-5465-4e02-8e01-ea813287134d","children":["80c4132e-ff66-43c6-b55a-732105770976"]},"9529e436-5465-4e02-8e01-ea813287134d":{"id":"9529e436-5465-4e02-8e01-ea813287134d","message":{"id":"9529e436-5465-4e02-8e01-ea813287134d","author":{"role":"system","metadata":{}},"content":{"content_type":"text","parts":[""]},"status":"finished_successfully","end_turn":true,"weight":0,"metadata":{"is_visually_hidden_from_conversation":true,"shared_conversation_id":"d131de93-ade0-49b7-a29f-a2264aa35ffd"},"recipient":"all"},"parent":"aaa1b0d4-17a7-410f-b553-f4185dd36fe1","children":["aaa22c02-ca4f-42e3-a0cf-38357de4fc33"]},"aaa1b0d4-17a7-410f-b553-f4185dd36fe1":{"id":"aaa1b0d4-17a7-410f-b553-f4185dd36fe1","children":["9529e436-5465-4e02-8e01-ea813287134d"]}},"moderation_results":[],"current_node":"80c4132e-ff66-43c6-b55a-732105770976","conversation_id":"d131de93-ade0-49b7-a29f-a2264aa35ffd","is_archived":false,"safe_urls":[],"is_public":true,"linear_conversation":[{"id":"aaa1b0d4-17a7-410f-b553-f4185dd36fe1","children":["9529e436-5465-4e02-8e01-ea813287134d"]},{"id":"9529e436-5465-4e02-8e01-ea813287134d","message":{"id":"9529e436-5465-4e02-8e01-ea813287134d","author":{"role":"system","metadata":{}},"content":{"content_type":"text","parts":[""]},"status":"finished_successfully","end_turn":true,"weight":0,"metadata":{"is_visually_hidden_from_conversation":true,"shared_conversation_id":"d131de93-ade0-49b7-a29f-a2264aa35ffd"},"recipient":"all"},"parent":"aaa1b0d4-17a7-410f-b553-f4185dd36fe1","children":["aaa22c02-ca4f-42e3-a0cf-38357de4fc33"]},{"id":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","message":{"id":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","author":{"role":"user","metadata":{}},"create_time":1709709042.976143,"content":{"content_type":"text","parts":["CREATE TABLE chat (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  query TEXT,\n  answer TEXT\n);\n\npostgresql create"]},"status":"finished_successfully","weight":1,"metadata":{"request_id":"8600870cfd874036-SIN","timestamp_":"absolute","shared_conversation_id":"d131de93-ade0-49b7-a29f-a2264aa35ffd"},"recipient":"all"},"parent":"9529e436-5465-4e02-8e01-ea813287134d","children":["80c4132e-ff66-43c6-b55a-732105770976"]},{"id":"80c4132e-ff66-43c6-b55a-732105770976","message":{"id":"80c4132e-ff66-43c6-b55a-732105770976","author":{"role":"assistant","metadata":{}},"create_time":1709709064.492545,"content":{"content_type":"text","parts":["The SQL statement you provided is mostly correct for creating a table in a PostgreSQL database, but with a slight adjustment needed for the `AUTO_INCREMENT` attribute, as PostgreSQL uses the `SERIAL` or `BIGSERIAL` data type for auto-incrementing integer values. Here's the adjusted SQL statement to create a table named `chat` in PostgreSQL:\n\n```sql\nCREATE TABLE chat (\n  id SERIAL PRIMARY KEY,\n  query TEXT,\n  answer TEXT\n);\n```\n\nIn this statement:\n- `id` is set as an auto-incrementing integer using `SERIAL`, which is suitable for most cases. If you expect the table to have a very large number of rows, consider using `BIGSERIAL` instead.\n- `PRIMARY KEY` designates the `id` column as the primary key.\n- The `query` and `answer` columns are set to store text data."]},"status":"finished_successfully","end_turn":true,"weight":1,"metadata":{"finish_details":{"type":"stop","stop_tokens":[100260]},"citations":[],"is_complete":true,"model_slug":"gpt-4","parent_id":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","request_id":"8600870cfd874036-SIN","timestamp_":"absolute","shared_conversation_id":"d131de93-ade0-49b7-a29f-a2264aa35ffd"},"recipient":"all"},"parent":"aaa22c02-ca4f-42e3-a0cf-38357de4fc33","children":[]}],"has_user_editable_context":false,"continue_conversation_url":"https://chat.openai.com/share/d131de93-ade0-49b7-a29f-a2264aa35ffd/continue","model":{"slug":"gpt-4","max_tokens":32767,"title":"Retrieval (msearch, context stuffing)","description":"Browsing, Advanced Data Analysis, and DALL路E are now built into GPT-4","tags":["alpha","gpt4"]},"moderation_state":{"has_been_moderated":false,"has_been_blocked":false,"has_been_accepted":false,"has_been_auto_blocked":false,"has_been_auto_moderated":false}}},"continueMode":false,"moderationMode":false,"plugins":null,"chatPageProps":{}},"__N_SSP":true},"page":"/share/[[...shareParams]]","query":{"shareParams":["d131de93-ade0-49b7-a29f-a2264aa35ffd"]},"buildId":"IqXD9fOmBGmuQ1vH0ysug","assetPrefix":"https://cdn.oaistatic.com","isFallback":false,"isExperimentalCompile":false,"gssp":true,"scriptLoader":[]}
	Props Props `json:"props"`
}

type Props struct {
	PageProps PageProps `json:"pageProps"`
}

type PageProps struct {
	ServerPrimedAllowBrowserStorageValue bool           `json:"serverPrimedAllowBrowserStorageValue"`
	IsStorageComplianceEnabled           bool           `json:"isStorageComplianceEnabled"`
	SharedConversationId                 string         `json:"sharedConversationId"`
	ServerResponse                       ServerResponse `json:"serverResponse"`
}

type ServerResponse struct {
	Type string `json:"type"`
	Data Data   `json:"data"`
}
type Data struct {
	Title                   string               `json:"title"`
	CreateTime              float64              `json:"create_time"`
	UpdateTime              float64              `json:"update_time"`
	Mapping                 map[string]Mapping   `json:"mapping"`
	ModerationResults       []interface{}        `json:"moderation_results"`
	CurrentNode             string               `json:"current_node"`
	ConversationId          string               `json:"conversation_id"`
	IsArchived              bool                 `json:"is_archived"`
	SafeUrls                []interface{}        `json:"safe_urls"`
	IsPublic                bool                 `json:"is_public"`
	LinearConversation      []LinearConversation `json:"linear_conversation"`
	HasUserEditableContext  bool                 `json:"has_user_editable_context"`
	ContinueConversationUrl string               `json:"continue_conversation_url"`
	Model                   Model                `json:"model"`
	ModerationState         ModerationState      `json:"moderation_state"`
}

type LinearConversation struct {
	Id       string   `json:"id"`
	Children []string `json:"children"`
}
type Model struct {
	Slug      string `json:"slug"`
	MaxTokens int    `json:"max_tokens"`
	Title     string `json:"title"`
}
type ModerationState struct {
	HasBeenModerated     bool `json:"has_been_moderated"`
	HasBeenBlocked       bool `json:"has_been_blocked"`
	HasBeenAccepted      bool `json:"has_been_accepted"`
	HasBeenAutoBlocked   bool `json:"has_been_auto_blocked"`
	HasBeenAutoModerated bool `json:"has_been_auto_moderated"`
}

type Mapping struct {
	Id       string   `json:"id"`
	Message  Message  `json:"message"`
	Parent   string   `json:"parent"`
	Children []string `json:"children"`
}

type Message struct {
	Id         string   `json:"id"`
	Author     Author   `json:"author"`
	CreateTime float64  `json:"create_time"`
	Content    Content  `json:"content"`
	Status     string   `json:"status"`
	Weight     int      `json:"weight"`
	Metadata   Metadata `json:"metadata"`
	Recipient  string   `json:"recipient"`
}

type Author struct {
	Role     string   `json:"role"`
	Metadata struct{} `json:"metadata"`
}

type Content struct {
	ContentType string   `json:"content_type"`
	Parts       []string `json:"parts"`
}

type Metadata struct {
	FinishDetails struct {
		Type       string `json:"type"`
		StopTokens []int  `json:"stop_tokens"`
	} `json:"finish_details"`
	Citations            []interface{} `json:"citations"`
	IsComplete           bool          `json:"is_complete"`
	ModelSlug            string        `json:"model_slug"`
	ParentId             string        `json:"parent_id"`
	RequestId            string        `json:"request_id"`
	Timestamp            string        `json:"timestamp_"`
	SharedConversationId string        `json:"shared_conversation_id"`
}
