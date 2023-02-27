module enum_fsm (input clk, reset, input int data[3:0], output int o);
enum int unsigned { S0 = 0, S1 = 2, S2 = 4, S3 = 8 } state, next_state;
always_comb begin : next_state_logic
	  next_state = S0;
	  case(state)
		S0: next_state = S1;
		S1: next_state = S2;
		S2: next_state = S3;
		S3: next_state = S3;
	  endcase
end
always_comb begin
	  case(state)
		 S0: o = data[3];
		 S1: o = data[2];
		 S2: o = data[1];
		 S3: o = data[0];
	  endcase
end
always_ff@(posedge clk or negedge reset) begin
	  if(~reset)
		 state <= S0;
	  else
		 state <= next_state;
end
endmodule