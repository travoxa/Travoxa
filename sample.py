from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Operating Systems Lab Codes & Outputs', 0, 1, 'C')
        self.ln(10)

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 6, title, 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, code, output):
        self.set_font('Courier', '', 10)
        self.set_fill_color(240, 240, 240)
        
        self.cell(0, 5, 'Source Code:', 0, 1)
        self.multi_cell(0, 5, code, 1, 'L', True)
        self.ln(5)
        
        self.set_font('Courier', 'B', 10)
        self.set_fill_color(30, 30, 30)
        self.set_text_color(255, 255, 255)
        
        self.cell(0, 5, 'Terminal Output:', 0, 1)
        self.set_text_color(50, 255, 50) # Matrix green for text
        self.multi_cell(0, 5, output, 1, 'L', True)
        
        self.set_text_color(0, 0, 0) # Reset to black
        self.ln(10)

pdf = PDF()
pdf.add_page()

# Data for the PDF
programs = [
    {
        "title": "1. Fork and Wait",
        "code": """#include<stdio.h>\n#include<unistd.h>\n#include<sys/types.h>\n#include<sys/wait.h>\nint main(){\n    pid_t pid;\n    
pid=fork();\n    if(pid<0){\n        perror("fork failed");\n        return 1;\n    }\n    else if(pid==0){\n        printf("PCCSL407 ");\n    
}\n    else{\n        wait(NULL);\n        printf("Operating Systems Lab\\n");\n    }\n    return 0;\n}""",
        "output": "user@localhost:~$ ./program1\nPCCSL407 Operating Systems Lab"
    },
    {
        "title": "2. Fork, PID, and Sleep",
        "code": """#include<stdio.h>\n#include<unistd.h>\n#include<sys/types.h>\nint main(){\n    pid_t pid;\n    pid=fork();\n    
if(pid<0){\n        perror("Fork failed");\n        return 1;\n    }\n    else if(pid==0) {\n        printf("Child Process: \\n");\n        
printf("Child PID: %d\\n", getpid());\n        printf("Parent PID: %d\\n", getppid());\n    }\n    else{\n        printf("Parent Process: 
\\n");\n        printf("Parent PID: %d\\n", getpid());\n        printf("Child PID: %d\\n", pid);\n        sleep(5);\n        return 0;\n    
}\n}""",
        "output": "user@localhost:~$ ./program2\nParent Process:\nParent PID: 3045\nChild PID: 3046\nChild Process:\nChild PID: 3046\nParent 
PID: 3045"
    },
    {
        "title": "3. Argument Adder (myadder.c)",
        "code": """#include <stdio.h>\n#include <stdlib.h>\nint main(int argc, char *argv[])\n{\n    if(argc!=3){\n        printf("Usage: %s 
<num1> <num2>\\n",argv[0]);\n        return 1;\n    }\n    int a= atoi(argv[1]);\n    int b= atoi(argv[2]);\n    int sum=a+b;\n    printf("Sum 
of %d and %d is %d\\n",a,b, sum);\n    return 0;\n}""",
        "output": "user@localhost:~$ gcc myadder.c -o myadder\nuser@localhost:~$ ./myadder 10 20\nSum of 10 and 20 is 30"
    },
    {
        "title": "4. Execvp Implementation",
        "code": """#include<stdio.h>\n#include<stdlib.h>\n#include<unistd.h>\n#include<sys/types.h>\n#include<sys/wait.h>\nint main(){\n    
pid_t pid;\n    pid=fork();\n    if(pid<0){\n        perror("Fork failed");\n        exit(1);\n    }\n    else if(pid==0) {\n        
printf("Child process (PID:%d) executing myadder...\\n", getpid());\n        char *args[]={"./myadder", "10", "20", NULL};\n        
execvp(args[0], args);\n        perror("execvp failed");\n        exit(1);\n    }\n    else{\n        printf("Parent process (PID: %d) created 
child (PID:%d)\\n", getpid(),pid);\n        wait(NULL);\n        printf("Child completed execution.\\n");\n    }\n    return 0;\n}""",
        "output": "user@localhost:~$ ./exec_demo\nParent process (PID: 4100) created child (PID:4101)\nChild process (PID:4101) executing 
myadder...\nSum of 10 and 20 is 30\nChild completed execution."
    }
]

for prog in programs:
    pdf.chapter_title(prog["title"])
    pdf.chapter_body(prog["code"], prog["output"])

pdf.output("OS_Lab_Codes_Output.pdf")
print("PDF generated successfully: OS_Lab_Codes_Output.pdf")
